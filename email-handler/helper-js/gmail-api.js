/**
 * Filename:    gmail-api.js
 * Author:      Andrew Forrester <andrew@andrew-forrester.com>
 * Code:        JavaScript/ECMAScript
 * Description: Set up Gmail API infrastructure to access messages in a
 *              gmail account, specified and authorized with `credentials.json`
 *              and `token.json`.
 * Note:        Code was originally from
 *              https://developers.google.com/gmail/api/quickstart/nodejs
 *              Now the code is split into different files and modified to
 *              access email messages rather than list the account labels.
 * Reference:   https://developers.google.com/gmail/api/reference/rest
 */

'use strict';
const { google } = require('googleapis')
const { dayInMS } = require('./date-utilities')

const max = 500  /* Maximum message IDs to fetch in a single request by
`gmail.users.messages.list`; set lower than the 500 maximum in order to stay
within usage-rate quota limits; paired with a timer to throttle the rate.  */



/**
 * Gets a message from the user's gmail account.
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {object} idObj - An object with IDs for a particular email message.
 */
async function getMessage(auth, idObj) {
  const gmail = google.gmail({ version: 'v1', auth })
  const queryParams = { userId: 'me', id: idObj.id }
  const message =
    await gmail.users.messages.get(queryParams)
      .then(resolvedValue => {
        return {
          gmailIDs: { id: idObj.id, threadId: idObj.threadId },
          msgPayload: resolvedValue.data.payload,
        }
      }, rejectedReason => {
        throw new Error(`The GmailAPI couldn't get message: ${rejectedReason}`)
      })
  return message
}


/**
 * Lists the message labels from the user's gmail account.
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {array} labelNameArr - An array of strings, each being a message label.
 */
async function getLabelIDs(auth, labelNameArr) {
  const gmail = google.gmail({ version: 'v1', auth })
  const queryParams = { userId: 'me' }
  const allLabelsArr =
    await gmail.users.labels.list(queryParams)
      .then(resolvedValue => {
        return resolvedValue.data.labels
      }, rejectedReason => {
        throw new Error(`The GmailAPI couldn't list labels: ${rejectedReason}`)
      })
  const labelIdArr = labelNameArr.map(name => {
    const matchingLabelObj = allLabelsArr.find(lObj => lObj.name === name)
    return matchingLabelObj.id
  })
  return labelIdArr
}


/**
 * Lists the messages from the user's gmail account -- but only the messages
 * that are labeled with all of the labels in labelArr.
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {array} labelsArr - An array of strings, each being a message label.
 */
async function listMessageIDs(auth, labelIDsArr) {
  let count = 1
  const gmail = google.gmail({ version: 'v1', auth })
  const queryParams = { userId: 'me', maxResults: max, labelIds: labelIDsArr }
  let newQueryParams = {}
  console.log(`\ncount: ${count}`)
  let batchData = await getIDsBatchData(gmail, queryParams)
  console.log(`resultSizeEstimate: ${batchData.resultSizeEstimate}`)
  let messagesToAdd = batchData.messages ?? []
  let messagesIDsList = messagesToAdd
  while (batchData.nextPageToken) {
    await generateTimerSec(1.5)
    console.log(`\ncount: ${++count}`)
    console.log(`resultSizeEstimate: ${batchData.resultSizeEstimate}`)
    newQueryParams = { ...queryParams, pageToken: batchData.nextPageToken }
    batchData = await getIDsBatchData(gmail, newQueryParams)
    messagesToAdd = batchData.messages ?? []
    messagesIDsList = [...messagesIDsList, ...messagesToAdd]
  }
  return messagesIDsList
}


/**
 * Lists the messages from the user's gmail account, beyond a certain date --
 * but only the messages that are labeled with all of the labels in labelArr.
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {array} labelsArr - An array of strings, each being a message label.
 * @param {number} afterDate - A JavaScript/ECMAScript date (in milliseconds).
 */
async function listMessageIDsAfter(auth, labelIDsArr, afterDate, isVerbose) {
  const gmail = google.gmail({ version: 'v1', auth })
  /* Use one day earlier to catch messages that came in on the same day as the
  ** last successful update but later on in the day: */
  const date = new Date(afterDate - dayInMS)
  const dateString = new Intl.DateTimeFormat('en-US').format(date)
  const query = `after: ${dateString}`
  const queryParams = {
    userId: 'me', maxResults: max, labelIds: labelIDsArr, q: query,
  }
  let newQueryParams = {}
  let batchData = await getIDsBatchData(gmail, queryParams)
  let messagesToAdd = batchData.messages ?? []
  let messagesIDsList = messagesToAdd
  let batchSize = messagesToAdd.length
  let count = 1
  while (batchData.nextPageToken) {
    if (isVerbose) {
      if (count === 1) {
        process.stdout.write(
          `Fetching email IDs in batches: ${count} (${batchSize})`
        )
      }
      else { process.stdout.write(`, ${count} (${batchSize})`) }
    }
    newQueryParams = { ...queryParams, pageToken: batchData.nextPageToken }
    batchData = await getIDsBatchData(gmail, newQueryParams)
    messagesToAdd = batchData.messages ?? []
    messagesIDsList = [...messagesIDsList, ...messagesToAdd]
    batchSize = messagesToAdd.length
    count++
  }
  if (isVerbose) {
    if (count > 1) { process.stdout.write(`, ${count} (${batchSize})\n\n`) }
  }
  return messagesIDsList
}


async function getIDsBatchData(gmail, queryParams) {
  const data = await gmail.users.messages.list(queryParams)
    .then(resolvedValue => {
      return resolvedValue.data
    })
    .catch(rejectedReason => {
      throw new Error(`The GmailAPI couldn't list msgs: ${rejectedReason}`)
    })
  return data
}


const googleAPIexports = {
  getLabelIDs,
  listMessageIDsAfter, listMessageIDs,
  getMessage
}

module.exports = googleAPIexports