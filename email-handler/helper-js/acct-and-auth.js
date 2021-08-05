/**
 * Filename:    acct-and-auth.js
 * Author:      Andrew Forrester <andrew@andrew-forrester.com>
 * Code:        JavaScript/ECMAScript
 * Description: Set up `googleapis` infrastructure to access messages in a
 *              gmail account, specified and authorized with `credentials.json`
 *              and `token.json`.
 * Note:        Code was originally from
 *              https://developers.google.com/gmail/api/quickstart/nodejs
 *              Now the code is split into different files and modified to
 *              access email messages rather than list the account labels.
 */

'use strict';
const fs = require('fs')
const readlinePromise = require('readline-promise').default
const { google } = require('googleapis')
const { assureFile } = require('./file-interact')
const { localTimeStampWithDay } = require('./date-utilities')

/* Paths for secure authorization, and auth logging and records
** (keeping old files for trouble-shooting). */
const {
  CREDS_PATH,
  TOKEN_PATH,
  AUTH_PATH,
  AUTH_LOG_PATH,
  AUTH_OLD_PATH,
} = require('../reference/paths')
// The file token.json (at TOKEN_PATH) stores the user's access and refresh
// tokens, and is created automatically when the authorization flow completes
// for the first time.

function setupNewRLP() {
  return readlinePromise.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']


// Get client's secret credentials from saved file
async function getCredentials() {
  let crdStr
  try { crdStr = await fs.promises.readFile(CREDS_PATH, { encoding: 'utf8' }) }
  catch (err) { throw new Error('Error loading client secret file:', err) }
  const creds = JSON.parse(crdStr)
  return creds
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function, and return callback payload, whether it's trivial
 * or not.
 * @param {object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @param {array} remainingArgs Parameter that collects remaining arguments, if
 * any, to pass to the callback function.
 */
async function authorize(credentials, callback, ...remainingArgsPrime) {
  const remainingArgs = remainingArgsPrime.slice(0, -1)
  const callbackName  = remainingArgsPrime.slice(-1) // actually an array

  // Prep for logging and file manipulation
  await assureFile(AUTH_LOG_PATH, generatePreamble)

  // Prep auth-client with credentials.
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  // Check for previously stored token; if none, get new/first token via user.
  let token, tokenString
  try {
    tokenString = await fs.promises.readFile(TOKEN_PATH, { encoding: 'utf8' })
    token = JSON.parse(tokenString)
  }
  catch (err) { token = await getNewTokenViaUserPrompt(oAuth2Client, callbackName) }
  oAuth2Client.setCredentials(token) // set client creds w/ token

  // Perform desired action (via callback) with token-enabled authorization.
  let callbackPayload
  try { callbackPayload = await callback(oAuth2Client, ...remainingArgs) }
  catch (err) {
    // If error is from token expiration, get new token via refresh, & retry.
    let now = new Date().getTime()
    if (now > token.expiry_date) {
      if (token.refresh_token) {
        const refreshToken = token.refresh_token
        token = await getNewTokenViaRefreshToken(oAuth2Client, refreshToken)
        oAuth2Client.setCredentials(JSON.parse(token)) // set clnt creds w/ tkn
        callbackPayload = await callback(oAuth2Client, ...remainingArgs)
      }
      else throw new Error(`There's no refresh token to in ${TOKEN_PATH}, ` +
        'so cannot get a new token via the refresh approach.')
    }
    // Otherwise log and pass along the error.
    else {
      const now = new Date()
      const timestamp = localTimeStampWithDay(now)
      const logMessage = `'${timestamp}', fail \`callback\` execution ` +
      `in \`authorize\`: ${err.message}\n`
      await fs.promises.appendFile(AUTH_LOG_PATH, logMessage)
      throw new Error(err)
    }
  }

  return callbackPayload
}


/**
 * Get and store a new access token by using a saved "refresh token", and log/
 * save activities and old files.
 * @param {string} refreshToken - A token used to get a new access token.
 */
async function getNewTokenViaRefreshToken(refreshToken) {

  // Prep for logging and file manipulation
  await assureFile(AUTH_LOG_PATH, generatePreamble)
  const shell = require('shelljs')
  const now = new Date()
  const timestamp = localTimeStampWithDay(now)
  let logMessage

  // Use an axios post request instead of Google API. Prep request.
  // (For reasons, see references [1] & [2].)
  const axios = require('axios')
  // const qs = require('qs') // query string operations
  // (Hm, haven't yet used `qs.stringify()` below...)
  // See web-app/client/src/services/user.service.js
  //  for usage in an axios get request, inside requestConfig.paramsSerializer
  const credsIn = getCredentials().installed
  const uri = credsIn.token_uri
  const requestConfig = {
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    client_id: credsIn.client_id,
    client_secret: credsIn.client_secret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  }

  // Use refreshToken (in requestConfig) to get new token.
  let tokenStr
  try { tokenStr = await axios.post(uri, requestConfig) }
  catch (err) {
    // Log error
    logMessage = `'${timestamp}', fail getNewTokenViaRefreshToken ` +
      ` -- axios.post request failed: ${err.message}\n`
    await fs.promises.appendFile(AUTH_LOG_PATH, logMessage)
    console.log(`Error refreshing access token: ${err.message}`)
  }
  // Save token immediately in case the rest of the data-handling is incorrect.
  // DELETE THIS LATER (once code is verified to be correct):
  await fs.promises.writeFile(
    `${AUTH_PATH}/refreshed-token_now${now.getTime()}.json`,
    tokenStr.toString()
  )
  // Assuming the handling is correct...
  const tokenObj = JSON.parse(tokenStr)

  // If there's no new refresh token, the current one should still work later.
  if (!tokenObj.refresh_token) tokenObj.refresh_token = refreshToken

  // Move old files before saving token in replacement file.
  shell.mv(TOKEN_PATH, `${AUTH_OLD_PATH}/`) // eg, ./token.json to ./auth/old-tokens/
  shell.mv(`${AUTH_PATH}/token_*`, `${AUTH_OLD_PATH}/`)
  shell.mv(`${AUTH_PATH}/refreshed-token_*`, `${AUTH_OLD_PATH}/`)

  // Store the refreshed token to disk for later program executions.
  try { await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(tokenObj)) }
  catch (err) {
    throw new Error(`Error writing to token file: ${err.message}`)
  }
  const tkString = await fs.promises.readFile(TOKEN_PATH, { encoding: 'utf8' })
  const newToken = JSON.parse(tkString)

  // Log
  logMessage = `'${timestamp}', executed getNewTokenViaRefreshToken\n`
  await fs.promises.appendFile(AUTH_LOG_PATH, logMessage)

  // Record another copy
  await fs.promises.writeFile(
    `${AUTH_PATH}/token_now${now.getTime()}-exp${newToken.expiry_date}.json`,
    JSON.stringify(newToken)
  )

  return newToken
}


/**
 * Get and store a new access token by prompting the user for manual gmail-
 * account-access authorization, and log/save activities and old files.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getNewTokenViaUserPrompt(oAuth2Client, callbackName) {

  // Prep for logging
  await assureFile(AUTH_LOG_PATH, generatePreamble)

  // User interaction to get authorization code for a new token.
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log(`(Note: This request is using callback \`${callbackName}\`.)\n`)
  console.log('Authorize this app by visiting this url:', authUrl)
  let rlp = setupNewRLP()
  let code = await rlp.questionAsync('Enter the code from that page here: ')
  rlp.close()

  // Use code to get new token.
  let bigTokenObj
  try { bigTokenObj = await oAuth2Client.getToken(code) }
  catch (err) {
    throw new Error(`Error retrieving access token: ${err.message}`)
  }
  const token = bigTokenObj.tokens
  console.log('\nNew token retrieved.') // aka `tokens`

  // Store the token to disk for later program executions.
  try { await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(token)) }
  catch (err) {
    console.log('token:')
    console.dir(token)
    throw new Error(`Error writing to token file: ${err.message}`)
  }
  console.log('Token stored to', TOKEN_PATH)
  const tkString = await fs.promises.readFile(TOKEN_PATH, { encoding: 'utf8' })
  const newToken = JSON.parse(tkString)

  // Log
  const now = new Date()
  const timestamp = localTimeStampWithDay(now)
  const logMessage = `'${timestamp}', executed getNewTokenViaUserPrompt ` +
    `(via ${callbackName})\n`
  await fs.promises.appendFile(AUTH_LOG_PATH, logMessage)

  // Note (logging to stdout should be okay for user-prompt version)
  console.log('\nNow:'.padEnd(29) + `${now.toString()}`)
  console.log('Token expiration date/time: ' +
    `${new Date(newToken.expiry_date).toString()}  (supposed)\n`)
  console.log('("Supposed" because the tokens don\'t seem to expire, or ' +
    'the tokens are refreshed behind-the-scenes...)\n')

  // Record another copy
  await fs.promises.writeFile(
    `${AUTH_PATH}/token_now${now.getTime()}-exp${newToken.expiry_date}.json`,
    JSON.stringify(newToken)
  )

  return newToken
}


function generatePreamble() {
  // generate initial key/column-labels for database update log (if needed)
  return 'This file is for simple record-keeping of some authorization / ' +
    'credentialing\nactivities.  The app itself does not use this file.  ' +
    'Delete contents at your\ndiscretion and leisure.\n\n'
}


/**
 *  References:
 *
 *  [1] https://www.oauth.com/oauth2-servers/making-authenticated-requests/refreshing-an-access-token/
 *      "To use the refresh token, make a POST request to the service’s token
 *      endpoint with grant_type=refresh_token, and include the refresh token
 *      as well as the client credentials.
 *      The response will be a new access token, and optionally a new refresh
 *      token, just like you received when exchanging the authorization code
 *      for an access token.
 *      If you do not get back a new refresh token, then it means your existing
 *      refresh token will continue to work when the new access token expires."
 *
 *  [2] https://developers.google.com/identity/protocols/oauth2/web-server#offline
 *      "Refreshing an access token (offline access)
 *      ...
 *      If you use a Google API Client Library, the client object refreshes the
 *      access token as needed as long as you configure that object for offline
 *      access."
 *        (So maybe I won't need to use the refresh token after all.  However,
 *         I've already had an access issue once -- where I was getting an
 *         `invalid_grant` error, I think, and I simply moved the token file
 *         and re-authorized access with the user-prompt / manual-clicking and
 *         copy-pasting method.  So I'm setting up refresh capabilities just in
 *         case that issue comes up again.)
 *      "To refresh an access token, your application sends an HTTPS POST
 *      request to Google's authorization server (https://oauth2.googleapis.com
 *      /token)...
 *      ... a sample request:
 *         POST /token HTTP/1.1
 *         Host: oauth2.googleapis.com
 *         Content-Type: application/x-www-form-urlencoded
 *         client_id=your_client_id&
 *         client_secret=your_client_secret&
 *         refresh_token=refresh_token&
 *         grant_type=refresh_token
 *      ... a sample response:
 *         {
 *           "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
 *           "expires_in": 3920,
 *           "scope": "https://www.googleapis.com/auth/drive.metadata.readonly",
 *           "token_type": "Bearer"
 *         }
 */


const authExports = { getCredentials, authorize }

module.exports = authExports