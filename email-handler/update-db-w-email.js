/**
 * Filename:    index.js
 * Author:      Andrew Forrester <andrew@andrew-forrester.com>
 * Code:        JavaScript/ECMAScript
 * Description: Get and save email messages (from a Gmail account, via
 *              `googleapis` and Gmail API) for processing and ingesting into a
 *              database.
 * Note:        Code was originally from
 *              https://developers.google.com/gmail/api/quickstart/nodejs
 *              Now the code is split into different files and modified to
 *              access email messages rather than list the account labels.
 * Vocab:       I (attempt) to distinguish between Gmail email messages and the
 *              "pieces" of a message, which can include the "main" piece and
 *              the attachments ("parts"), which can contain copies of email
 *              messages that also need to be processed.  (The term "parts"
 *              comes from the gmail api data structures; I didn't choose that
 *              ambiguous and incomplete terminology myself.)
 */

// TODO
// Come up with a way to test my refresh-token code (including the shelljs mv
// functionality).  Is the refresh-token stuff done behind the scenes?

/**
 * Known issue: assignment of date integer labels is done with a rough
 * calculation of number of days (positive or negative) from a reference date.
 * After some amount of time (thousands of years?) this will fail to be correct
 * and there will be a collision between two reports that are assigned the same
 * integer label.  See: `dateDiffInDays` in `helper-js/date-utilities.js`.
 */

'use strict';
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const {
  assureFile, assureJSONfile, getJSONobject, setJSONobject
} = require('./helper-js/file-interact')
const { getCredentials, authorize } = require('./helper-js/acct-and-auth')
const ensureAndGetLabelIDs = require('./helper-js/ensure-labels')
const { listMessageIDsAfter, getMessage } = require('./helper-js/gmail-api')
const {
  getNumGmails, getNumPieces, getNumAttchs, getNumMnPces,
  updateCountTots, checkCountConsistency,
  simplifyHeaders, getRelevantAttachments, parseSaveAndTally
} = require('./helper-js/process-msg')
const { localTimeStampWithDay } = require('./helper-js/date-utilities')
const clog = console.log

// Record file names:
const emailRecordsFileName =
  path.resolve(__dirname, './records/email-ingestion-records.json')
const logFileName =
  path.resolve(__dirname, './records/updates-stats.log')
const lastMsgsRecordsFileName =
  path.resolve(__dirname, './records/last-msgs-list.json')

// Email account info:
const {
  labelsRequire, oldDate, refreshDate,
} = require('./reference/email-acct-info')

// Handler modes:
const reprocessModeFileName = 'reprocess-mode.js'
const reprocessModeFile =
  path.resolve(__dirname, `./handler-modes/${reprocessModeFileName}`)
const {
  emailHandlerIsInReprocessMode, addTroubleMsgsFileName,
} = require(reprocessModeFile)
const verboseModeFileLocation = './handler-modes/verbose-mode'
const isVerbose = require(verboseModeFileLocation) // print logs to screen

// For dynamic (write and erase and re-write) console logging:
const readline = require('readline')
readline.Interface.prototype._insertString =
  require('./helper-js/readline-fix')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})



/**
 * Update the database via Sequelize after checking the Gmail email account for
 * business report email messages (and messages containing copies of reports)
 * and parsing any new messages into objects with the desired data.
 * @param {function} Model - A Sequelize model/class linked to database table.
 */
async function updateDatabaseWithEmail(Model) {

  // Initialize success variable
  let isUpdateSuccess = false

  const subTallyTemplate = {
    initial: {
      toBeProcessed: 0,
      dupInDbTot: 0, failToDbTot: 0, nonDataTot: 0,
    },
    final:   {
      processed: 0,
      addedToDb: 0,
      dupInDbProc: 0,  dupInDbTot: 0,
      failToDbProc: 0, // initial failToDbTot =/= final failToDbProc
      nonDataProc: 0,  nonDataTot: 0,
    }
  }

  // Prep for basic tally.
  let count = {
    // ~ email message containers (containing pieces w/ content)
    msgGmails: {
      initial: {
        toBeRetrieved: 0, toBeProcessed: 0, match: false,
      }, // `match` tests equality of msgGmails toBeRetrieved and toBeProcessed
      final:   {      // gmail msgs are fully processed after all pieces are
        processed: 0, // whole messages not added to db (but main pieces are)
      },
    },
    //  main pieces
    msgMnPces: _.cloneDeep(subTallyTemplate),
    // 'part' pieces (= attachments)
    msgAttchs: _.cloneDeep(subTallyTemplate),
    //  all pieces (both main and parts/attachments)
    msgPieces: _.cloneDeep(subTallyTemplate),
    isConsistent: false, // to measure consistency of numbers
  }

  // Get records.
  await assureJSONfile(emailRecordsFileName, generateInitialRecord)
  const emailIngestRecords = await getJSONobject(emailRecordsFileName)
  let   reportsAdded     = emailIngestRecords.reportsAdded
  const updateAttempts   = emailIngestRecords.updateAttempts
  let   nonDataPcs       = emailIngestRecords.piecesNotRecognizedAsData
  let   troublePcs       = emailIngestRecords.dataPiecesFailedToLoadIntoDb
  let   dupPieces        = emailIngestRecords.piecesWithAlreadyIngestedReport
  let   nonDataGmailsIDs = nonDataPcs.map(msgObj => msgObj.id)
  let   troubleGmailsIDs = troublePcs.map(idObj => idObj.id)
  const dupGmailsIDs     = dupPieces.map(idObj => idObj.id)
  /* Note: The reportsAdded, nonDataPcs, and dupPieces arrays are to-be edited
  ** within their elements (which are objects), not just pushing new elements
  ** onto them. Changed const to let for troublePcs & troubleGmailsIDs to
  ** enable re-processing of old mis-parsed message that we mis-catetorized as
  ** non-data messages. */

  // Optional additional trouble messages (previously categorized as non-data)
  let additionalTroubleMsgs
  if (emailHandlerIsInReprocessMode) {
    additionalTroubleMsgs = await getJSONobject(addTroubleMsgsFileName)
    // add old messages to troublePcs
    troublePcs = [...troublePcs, ...additionalTroubleMsgs]
    troubleGmailsIDs = troublePcs.map(idObj => idObj.id)
    // and remove them from the nonDataPcs records
    nonDataPcs = removeMsgs(troublePcs, nonDataPcs, isVerbose)
    resetReprocessModeFile()
  }

  // Initial tally
  count.msgMnPces.initial.nonDataTot  = getNumMnPces(nonDataPcs)
  count.msgAttchs.initial.nonDataTot  = getNumAttchs(nonDataPcs)
  count.msgPieces.initial.nonDataTot  = getNumPieces(nonDataPcs)
  count.msgMnPces.initial.failToDbTot = getNumMnPces(troublePcs)
  count.msgAttchs.initial.failToDbTot = getNumAttchs(troublePcs)
  count.msgPieces.initial.failToDbTot = getNumPieces(troublePcs)
  count.msgMnPces.initial.dupInDbTot  = getNumMnPces(dupPieces)
  count.msgAttchs.initial.dupInDbTot  = getNumAttchs(dupPieces)
  count.msgPieces.initial.dupInDbTot  = getNumPieces(dupPieces)


  // In case of errors, save failure now (& correct later in code if success).
  const today = Date.now()
  const inCaseOfFailure = { date: today, success: isUpdateSuccess }
  const updateAttemptWithNewFail = [inCaseOfFailure, ...updateAttempts]
  const emailIngestRecordsFail = {
    updateAttempts: updateAttemptWithNewFail,
    dataPiecesFailedToLoadIntoDb:    troublePcs,
    piecesWithAlreadyIngestedReport: dupPieces,
    piecesNotRecognizedAsData:       nonDataPcs,
    reportsAdded,
  }
  await setJSONobject(emailRecordsFileName, emailIngestRecordsFail)


  // Find the date of the last successful nonempty update.
  let i = 0  // The first index is for the most recent update.
  for (i = 0; i < updateAttempts.length; i++) {
    if (updateAttempts[i].success && updateAttempts[i].addedPcs.length > 0)
      break
  }
  // if no successful-nonempty updates were found, set date to oldDate
  let d // ~ lastSuccessfulUpdateDate
  let s // ~ lastSavedGmlsIDs
  if (i === updateAttempts.length) {
    d = oldDate
    s = []
  }
  else {
    d = updateAttempts[i].date
    s = updateAttempts[i].addedPcs.map(msgObj => msgObj.id)
  }
  const lastSuccessfulUpdateDate = d
  const lastSavedGmlsIDs = s
  if (isVerbose) {
    clog('NOTE: Last successful non-empty update was on: ' +
      `${new Date(lastSuccessfulUpdateDate)}\n`)
  }

  // Get auth-client's secret credentials from a local file.
  const creds = await getCredentials()

  // Ensure the message-label restriction is set.
  const {
    needRefresh, labelIDsRequire
  } = await ensureAndGetLabelIDs(creds, labelsRequire)
  const referenceDate = needRefresh ? refreshDate : lastSuccessfulUpdateDate

  /* Get list of IDs of messages in email account that arrived since last
  ** successful nonempty update. */
  const latestGmailsIDs =
    await authorize(
      creds, listMessageIDsAfter, labelIDsRequire, referenceDate, isVerbose,
      'listMessageIDsAfter'
    )

  // Identify messages that are actually new and not already saved/processed.
  const gmailsToRetrieveNew = latestGmailsIDs.filter( msgObj =>
    !lastSavedGmlsIDs.includes(msgObj.id) &&
    !nonDataGmailsIDs.includes(msgObj.id) &&
    !troubleGmailsIDs.includes(msgObj.id) &&
    !dupGmailsIDs.includes(msgObj.id)
  )

  /* Add any old troublesome messages (IDs) that weren't able to load into the
  ** database before. */
  const gmailsToRetrieve = [...gmailsToRetrieveNew, ...troublePcs]

  // Overview before retrieval
  count.msgGmails.initial.toBeRetrieved = getNumGmails(gmailsToRetrieve)
  // need `.length` here above (not getNumMnPces) to count whole gmail messages
  const bfl = [] // brief labels
  const labels = []
  const vals = []
  // prep for easy assignment
  for (let i = 6; i <= 13; i++) { vals[i] = {} }
  // Note: saving indices 0 and 1 for two consistency checks
  bfl[3] = 'all'
  bfl[4] = 'new'
  bfl[5] = 'old'
  labels[3] = '# of (gmail msgs) to retrieve'
  labels[4] = '# of these (msgs) that are new'
  labels[5] = '# of these (msgs) that are old (containing fails/retries)'
  vals[3] = count.msgGmails.initial.toBeRetrieved
  vals[4] = getNumGmails(gmailsToRetrieveNew)
  vals[5] = getNumGmails(troublePcs)
  const pad = 70
  if (isVerbose) {
    clog('TO RETRIEVE:'.padEnd(pad) + ' gm')
    clog((` 3. ${labels[3]}:`).padEnd(pad) +`${displayN(vals[3])}   ${bfl[3]}`)
    clog((` 4. ${labels[4]}:`).padEnd(pad) +`${displayN(vals[4])}   ${bfl[4]}`)
    clog((` 5. ${labels[5]}:`).padEnd(pad) +`${displayN(vals[5])}   ${bfl[5]}`)
    clog('')
  }


  /* Get list of messages -- retrieve each email message from account with full
  ** metadata, then remove excess metadata and add to list. Be sure to keep
  ** relevant attachments to find if there are copies of data messages in the
  ** form of `.eml` files. */
  // TOO EFFICIENT (the Gmail API limits usage rates, so parallel code is bad).

  // Old efficient version:
  // const messagesFullList = await Promise.all(
  //   gmailsToRetrieve.map(
  //     idObj => authorize(creds, getMessage, idObj, 'getMessage')
  // ))
  // (rest of code erased, transforming messagesFullList to messagesSimpleList)

  // New efficient version:
  // async function handleMsgFullObj(creds, callback, idObj, callbackName) {
  //   const msgFullObj = await authorize(creds, callback, idObj, callbackName)
  //   const gmailIDs = msgFullObj.gmailIDs
  //   const simpleHeaders = simplifyHeaders(msgFullObj.msgPayload.headers)
  //   const body = msgFullObj.msgPayload.body.data
  //   const attachments = getRelevantAttachments(msgFullObj.msgPayload.parts)
  //   const msgSimpleObj = {
  //     gmailIDs, headers: simpleHeaders, bodyAsBase64String: body, attachments
  //   }
  //   return msgSimpleObj
  // }

  // const messagesList = await Promise.all(
  //   gmailsToRetrieve.map(idObj => handleMsgFullObj(
  //     creds, getMessage, idObj, 'getMessage'
  //   ))
  // )

  // Gmail-accepted inefficient version:
  let msgFetchCount = 1
  let messagesList = []
  let msgFullObj, msgSimpleObj
  if (isVerbose) {
    rl.write('Retrieving messages. ' +
      `Now on message # ${displayPadNum(4, msgFetchCount)}`)
  }
  for (let idObj of gmailsToRetrieve) {
    if (isVerbose) {
      readline.moveCursor(process.stdout, -4, 0)
      rl.write(`${displayPadNum(4, msgFetchCount)}`)
    }
    msgFullObj = await authorize(creds, getMessage, idObj, 'getMessage')
    const gmailIDs = msgFullObj.gmailIDs
    const simpleHeaders = simplifyHeaders(msgFullObj.msgPayload.headers)
    const body = msgFullObj.msgPayload.body.data
    const attachments = getRelevantAttachments(msgFullObj.msgPayload.parts)
    msgSimpleObj = {
      gmailIDs, headers: simpleHeaders, bodyAsBase64String: body, attachments
    }
    messagesList.push(msgSimpleObj)
    msgFetchCount++
  }
  if (isVerbose) {
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0)
    rl.close()
  }

  // messagesList = [
  //   {
  //     gmailIDs: {..},
  //     headers: {..},
  //     bodyAsBase64String: str
  //   }
  //   <OR>
  //   {
  //     gmailIDs: {..},
  //     headers: {..},
  //     bodyAsBase64String: str
  //     attachments: [
  //       {
  //         partID: #,
  //         headers: {..},
  //         bodyAsBase64String: str
  //       },
  //       ..
  //     ]
  //   },
  //   ..
  // ]

  // Record.
  await assureJSONfile(lastMsgsRecordsFileName)
  await setJSONobject(lastMsgsRecordsFileName, messagesList)


  // Intermediate tally
  count.msgGmails.initial.toBeProcessed = getNumGmails(messagesList)
  count.msgMnPces.initial.toBeProcessed = getNumMnPces(messagesList)
  count.msgAttchs.initial.toBeProcessed = getNumAttchs(messagesList)
  count.msgPieces.initial.toBeProcessed = getNumPieces(messagesList)
  count.msgGmails.initial.match =
    (count.msgGmails.initial.toBeRetrieved ===
      count.msgGmails.initial.toBeProcessed)
  labels[2] = 'Match between (gmail msgs) to retrieve and process (boolean)'
  vals[2] = count.msgGmails.initial.match
  //const msgsToProcessIDs = messagesList.map(msgObj => msgObj.gmailIDs.id)
  const theNewIDs = gmailsToRetrieveNew.map(msgObj => msgObj.id)
  const theOldIDs = troubleGmailsIDs
  const theNew = messagesList.filter(
    msgObj => theNewIDs.includes(msgObj.gmailIDs.id)
  )
  const theOld = messagesList.filter(
    msgObj => theOldIDs.includes(msgObj.gmailIDs.id)
  )

  // Overview before processing
  bfl[6] = 'all'
  bfl[7] = 'new'
  bfl[8] = 'old'
  labels[6] = '# of (gmail msgs), (mn pcs), (pt pcs), (pcs) to process'
  labels[7] = '# of these (msgs), (mn pcs), (pt pcs), (pcs) that are new'
  labels[8] = '# of these (msgs), (mn pcs), (pt pcs), (pcs) that are old/retry'
  vals[6].a = count.msgGmails.initial.toBeProcessed
  vals[6].b = count.msgMnPces.initial.toBeProcessed
  vals[6].c = count.msgAttchs.initial.toBeProcessed
  vals[6].d = count.msgPieces.initial.toBeProcessed
  vals[7].a = getNumGmails(theNew)
  vals[7].b = getNumMnPces(theNew)
  vals[7].c = getNumAttchs(theNew)
  vals[7].d = getNumPieces(theNew)
  vals[8].a = getNumGmails(theOld)
  vals[8].b = getNumMnPces(theOld)
  vals[8].c = getNumAttchs(theOld)
  vals[8].d = getNumPieces(theOld)
  if (isVerbose) {
    clog('TO PROCESS:'.padEnd(pad) + ' gm   mn   pt   pc')
    for (let i = 6; i <= 8; i++) {
      printInfoWithFourNumbers(i, vals, labels, bfl, pad)
    }
    clog('')
  }

  // Update database: parse data from email messages and save/ingest into db.
  let newAddedPcs = []
  let newTroublePcs = []
  let tally = {
    reportsAdded, newAddedPcs, dupPieces, newTroublePcs, nonDataPcs, count
  }
  for (const msgObj of messagesList) {
    try { tally = await parseSaveAndTally(msgObj, Model, tally) }
    catch (err) { /* log? */ }
  }
  updateCountTots(tally)
  reportsAdded = tally.reportsAdded
  newAddedPcs = tally.newAddedPcs
  dupPieces = tally.dupPieces
  newTroublePcs = tally.newTroublePcs
  nonDataPcs = tally.nonDataPcs
  count = tally.count
  count.isConsistent = checkCountConsistency(tally)


  // Update records.
  isUpdateSuccess = true
  const successRecord = {
    date: today, success: isUpdateSuccess, addedPcs: newAddedPcs
  }
  let modAttemptUpdates = updateAttempts
  if (updateAttempts[0].date === oldDate) {
    modAttemptUpdates = updateAttempts.slice(1)
  }
  const updatedUpdateAttempts = [successRecord, ...modAttemptUpdates]
  const updates = { updateAttempts: updatedUpdateAttempts}      // cumulative
  const dups = { piecesWithAlreadyIngestedReport: dupPieces }   //  edited
  const fails = { dataPiecesFailedToLoadIntoDb: newTroublePcs } //   new
  const nonData = { piecesNotRecognizedAsData: nonDataPcs }     //  edited
  const newRecords = {
    ...updates, ...dups, ...fails, ...nonData, reportsAdded,
  }
  await setJSONobject(emailRecordsFileName, newRecords)

  // Summary
  bfl[9] = 'all'
  bfl[10] = 'added'
  bfl[11] = 'dups'
  bfl[12] = 'fails'
  bfl[13] = 'nondat'
  labels[9]  = '# of (gmail msgs), (mn pcs), (pt pcs), (msg pieces) processed'
  labels[10] = '# of these (mn pcs), (pt pcs), (pcs) added to database (db)'
  labels[11] = '# of these (mn pcs), (pt pcs), (pcs) were dups (so not added)'
  labels[12] = '# of these (mn pcs), (pt pcs), (pcs) with fails in add-to-db'
  labels[13] = '# of these (mn pcs), (pt pcs), (pcs) not recognized as data'
  vals[9].a  = count.msgGmails.final.processed
  vals[9].b  = count.msgMnPces.final.processed
  vals[9].c  = count.msgAttchs.final.processed
  vals[9].d  = count.msgPieces.final.processed
  vals[10].a = count.msgMnPces.final.addedToDb
  vals[10].b = count.msgAttchs.final.addedToDb
  vals[10].c = count.msgPieces.final.addedToDb
  vals[11].a = count.msgMnPces.final.dupInDbProc
  vals[11].b = count.msgAttchs.final.dupInDbProc
  vals[11].c = count.msgPieces.final.dupInDbProc
  vals[12].a = count.msgMnPces.final.failToDbProc
  vals[12].b = count.msgAttchs.final.failToDbProc
  vals[12].c = count.msgPieces.final.failToDbProc
  vals[13].a = count.msgMnPces.final.nonDataProc
  vals[13].b = count.msgAttchs.final.nonDataProc
  vals[13].c = count.msgPieces.final.nonDataProc
  labels[1] = 'Count is consistent boolean (Consistency of tallies)'
  vals[1]   = count.isConsistent
  if (isVerbose) {
    clog('PROCESSED:'.padEnd(pad) + ' gm   mn   pt   pc')
    printInfoWithFourNumbers(9, vals, labels, bfl, pad)
    for (let i = 10; i <= 13; i++) {
      printInfoWithThreeNumbers(i, vals, labels, bfl, pad)
    }
    clog('')
    clog(` 2. Do retreived and processed numbers match?  ` +
      `${yesORno(count.msgGmails.initial.match)}`)
    clog(` 1. Are all the tabulations consistent?        ` +
      `${yesORno(count.isConsistent)}\n`)
    // Optional count check
    //clog('count:')
    //console.dir(count)
  }


  // Log
  labels[0] = 'Update date'
  vals[0]   = `'${localTimeStampWithDay(today)}'`
  await assureFile(logFileName, generateKey(labels))
  const updateStats =
    vals.slice(0, 6).join(', ') +
    ', ' +
    vals.slice(6, 10)
      .map(obj => `${obj.a}, ${obj.b}, ${obj.c}, ${obj.d}`).join(', ') +
    ', ' +
    vals.slice(10)
      .map(obj => `${obj.a}, ${obj.b}, ${obj.c}`).join(', ') + '\n'
  await fs.promises.appendFile(logFileName, updateStats)

}



/* Minor supporting functions ************************************************/

function generateInitialRecord() {
  // generate initial JSON string for email-ingestion-records.json (if needed)
  return '{ ' +
    '"updateAttempts": [' +
      '{' +
        `"date": ${oldDate},` +
        '"success": true, ' +
        '"addedPcs": []' +
      '}' +
    '], ' +
    '"dataPiecesFailedToLoadIntoDb": [], ' +
    '"piecesWithAlreadyIngestedReport": [], ' +
    '"piecesNotRecognizedAsData": [], ' +
    '"reportsAdded": {} ' +
  '}'
}
// When record is filled in:
// {
//   updateAttempts: [
//     {date: #, success: bool,
//       addedPcs: [
//         {id: str, threadId: str, dbIDs: {main: #|null, '3': #, ..}},
//         ..
//     ]},
//     ..
//   ],
//   piecesWithAlreadyIngestedReport: [
//     {id: str, threadId: str, dbIDs: {main: #|null, '5': #, ..}},
//     ..
//   ],
//   piecesNotRecognizedAsData: [
//     {id: str, threadId: str}
//     <OR>
//     {id: str, threadId: str, parts: {main: bool, attch: ['4', ..]}},
//     ..
//   ],
//   dataPiecesFailedToLoadIntoDb: [
//     {id: str, threadId: str}
//     <OR>
//     {id: str, threadId: str, parts: {main: bool, attch: ['2', ..]}},
//     ..
//   ],
//   reportsAdded: {
//     '[reportInt]': {dbID: reportID, bay1: bool, bay2: bool},
//     ..
//   }
// }
// Notes:
//  1) `addedPcs` can contain zero or more messages (msg objects).
//  2) A message can have one or more dbIDs, depending on whether it is an
//     auto-sent business report or a message containing attachments of copies
//     of reports.
//  3) The `parts` property is is only present if parts/attch's are involved.
//  4) The `dbIDs` in `piecesWithAlreadyIngestedReport` are the IDs of the
//     already-ingested reports.  (These duplicates aren't ingested into the
//     database, so they technically don't get their own database IDs.)


function generateKey(keys) {
  // generate initial key/column-labels for database update log (if needed)
  const padding = 55
  return () => keys.reduce(
    (accum, key, index) => getAccumString(accum, key, index, padding),
    ''
  )
}

function getAccumString(accum, key, index, padding) {
  let label, offset
  if (index < 6) {
    label = `Element ${displayNum(index)}`
    return accum + (`${label}:`).padEnd(padding) + `${key}\n`
  }
  else if (index < 10) {
    offset = 6
    label = `Element ` +
      `${displayNum(6+4*(index-6)+0)} & ` +
      `${displayNum(6+4*(index-6)+1)} & ` +
      `${displayNum(6+4*(index-6)+2)} & ` +
      `${displayNum(6+4*(index-6)+3)} ` +
      `(or ` +
      `${displayNum(index)}a & ${displayNum(index)}b & ` +
      `${displayNum(index)}c & ${displayNum(index)}d` +
      `)`
    return accum + (`${label}:`).padEnd(padding) + `${key}\n`
  }
  else {
    offset = 6+4*(9-6)+4  // 22
    label = `Element ` +
      `${displayNum(22+3*(index-10)+0)} & ` +
      `${displayNum(22+3*(index-10)+1)} & ` +
      `${displayNum(22+3*(index-10)+2)} ` + `     ` +
      `(or ` +
      `${displayNum(index)}a & ${displayNum(index)}b & ` +
      `${displayNum(index)}c` +
      `)`
    return accum + (`${label}:`).padEnd(padding) + `${key}\n`
  }
}

function displayPadNum(pad, num) {
  return num.toString().padStart(pad, ' ')
}

function displayNum(num) {
  return num.toString().padStart(2, ' ')
}

function displayN(num) {
  return num.toString().padStart(3, ' ')
}

function yesORno(bool) {
  return bool ? 'Yes.' : 'No.'
}

function printInfoWithFourNumbers(index, vals, labels, bfl, pad) {
  clog(
    (`${displayNum(index)}. ${labels[index]}:`).padEnd(pad) +
    `${displayN(vals[index].a)}, ${displayN(vals[index].b)}, ` +
    `${displayN(vals[index].c)}, ${displayN(vals[index].d)}  ` +
    ` ${bfl[index]}`
  )
}

function printInfoWithThreeNumbers(index, vals, labels, bfl, pad) {
  clog(
    (`${displayNum(index)}. ${labels[index]}:`).padEnd(pad+5) +
    `${displayN(vals[index].a)}, ${displayN(vals[index].b)}, ` +
    `${displayN(vals[index].c)}  ` +
    ` ${bfl[index]}`
  )
}

function removeMsgs(removeTheseArray, fromThisArray, isVerbose) {
  let newArray = _.cloneDeep(fromThisArray)
  let removeMsgIDs = removeTheseArray.map(msgObj => msgObj.id)
  let removeMsgThreadIDs = removeTheseArray.map(msgObj => msgObj.threadId)
  const len = removeTheseArray.length
  let removeIndices = []
  for (let [index, msgObj] of newArray.entries()) {
    if (
      removeMsgIDs.includes(msgObj.id) &&
      removeMsgThreadIDs.includes(msgObj.threadId)
    ) {
      removeIndices.push(index)
    }
  }
  if (isVerbose) {
    // print warning if count isn't correct
    if (removeIndices.length !== len) {
      console.log('WARNING!: The number of messages being removed from the ' +
        'old non-data messages is not the same as the number of old ' +
        'non-data messages being reprocessed (as trouble messages).')
    }
  }
  removeIndices.reverse().forEach(listedIndex =>
    newArray.splice(listedIndex, 1) // delete one element at listedIndex
  )
  return newArray
}

function resetReprocessModeFile() {
  const string = '' +
    'exports.emailHandlerIsInReprocessMode = false' + '\n\n' +
    '// Replace file name with the most current version:' + '\n' +
    'exports.addTroubleMsgsFileName =' + '\n' +
    `  '${addTroubleMsgsFileName}'`
  fs.promises.writeFile(reprocessModeFile, string)
}


module.exports = updateDatabaseWithEmail