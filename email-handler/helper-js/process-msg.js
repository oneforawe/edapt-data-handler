const { parseEmailMsg } = require('./parse-email-msg')


//const simpleHeaderNames = ['Date', 'From', 'To', 'Subject']
const simpleHeaderNames = ['Date', 'Subject']


function filterForSimpleHeaders(longHeadersList) {
  const simpleHeaders = longHeadersList.filter(
    headerObj => {if (simpleHeaderNames.includes(headerObj.name)) return true}
  )
  return simpleHeaders
}

function convertArrayToObject(array) {
  // turn a list of unique simple objects into an object of unique properties
  // EG [{date: "THE DATE"}, ...] -> {date: "THE DATE", ...}
  let obj = {}
  array.forEach( elementObj => {
    // "loop" over the single [key, value] pair in this elementObj
    for (const [key, value] of Object.entries(elementObj)) {
      obj[key] = value
    }
  })
  return obj
}

function simplifyHeaders(complexHeaders) {
  let simpleHeaders = filterForSimpleHeaders(complexHeaders)
  // Now turn {name: "Date", value: "THE DATE"} into {date: "THE DATE"}, etc:
  simpleHeaders = simpleHeaders.map(
      header => ({ [header.name.toLowerCase()]: header.value })
  )
  // Now turn list of unique simple objects into object of unique properties:
  // EG [{date: "THE DATE"}, ...] -> {date: "THE DATE", ...}
  simpleHeaders = convertArrayToObject(simpleHeaders)
  return simpleHeaders
}

function getRelevantAttachments(msgParts) {
  return msgParts ?
    // If there are parts/attachments, filter for reports, then simplify.
    msgParts
    .filter(part => part.filename && part.filename.slice(-4) === '.eml')
    .map(part => {
      const partId = part.partId
      const msgPayload = part.parts[0]
      const simpleHeaders = simplifyHeaders(msgPayload.headers)
      const body = msgPayload.body.data
      return { partId, headers: simpleHeaders, bodyAsBase64String: body }
    })
    :
    // If there are no reports, there are no relevant attachments.
    []
}


async function parseSaveAndTally(msgObj, Model, tally) {

  const isProcessDebugVerbose = false

  let reportsAdded = tally.reportsAdded
  let newAddedPcs = tally.newAddedPcs
  let dupPieces = tally.dupPieces
  let newTroublePcs = tally.newTroublePcs
  let nonDataPcs = tally.nonDataPcs
  let count = tally.count
  let record = {}

  // First deal with any attachments/parts.
  let partsAddedDbIDs = {} // Added to the db (indicated w/ assigned db id)
  let partsDupsDbIDs = {} // Not added to db (ind. w/ id of existing report)
  let partsTrouble = { attch: [] } // aka Failed when attempt to add to db
  let partsNonData = { attch: [] }
  for (let part of msgObj.attachments) {
    try {
      const reportObj = parseEmailMsg(part)
      if (reportIsDuplicate(reportObj, reportsAdded)) {
        // Old report; don't add to db; add to duplicates
        addPartToDups(part, reportObj, partsDupsDbIDs, reportsAdded)
        count.msgAttchs.final.dupInDbProc++
        count.msgPieces.final.dupInDbProc++
      }
      else {
        // New report; add to db; add to reports-added; add to new-added
        try {
          // test failures:
          //if (part.partId === '5') { throw new Error('NOT 5') }
          record = await Model.create(reportObj) // save/insert record into db
          // record ~ reportObj + id  (could call it `recordObj`)
          addReportToReportsAdded(record, reportsAdded)
          partsAddedDbIDs[part.partId] = record.id
          count.msgAttchs.final.addedToDb++
          count.msgPieces.final.addedToDb++
        }
        catch (err) {
          // Data message/part wouldn't load into database.
          if (isProcessDebugVerbose) { console.log(err) }
          partsTrouble.attch.push(part.partId)
          count.msgAttchs.final.failToDbProc++
          count.msgPieces.final.failToDbProc++
        }
      }
    }
    catch (err) {
      // Message wouldn't parse; not recognized as data-oriented.
      if (isProcessDebugVerbose) { console.log(err) }
      partsNonData.attch.push(part.partId)
      count.msgAttchs.final.nonDataProc++
      count.msgPieces.final.nonDataProc++
    }
    count.msgAttchs.final.processed++
    count.msgPieces.final.processed++
  }

  // Then deal with the main message, starting with defaults.
  let mainAddedDbID = {main: null} // Added to db (indicated w/ assigned db id)
  let mainDupDbID = { main: null } // Not added (ind. w/ id of existing report)
  let mainTrouble = { main: false } // aka Failed when attempt to add to db
  let mainNonData = { main: false }
  try {
    const reportObj = parseEmailMsg(msgObj)
    if (reportIsDuplicate(reportObj, reportsAdded)) {
      // Old report; don't add to db; add to duplicates
      addMainToDups(reportObj, mainDupDbID, reportsAdded)
      count.msgMnPces.final.dupInDbProc++
      count.msgPieces.final.dupInDbProc++
    }
    else {
      // New report; add to db; add to reports-added; add to new-added
      try {
        record = await Model.create(reportObj) // save/insert record into db
        // record ~ reportObj + id  (could call it `recordObj`)
        addReportToReportsAdded(record, reportsAdded)
        mainAddedDbID.main = record.id
        count.msgMnPces.final.addedToDb++
        count.msgPieces.final.addedToDb++
      }
      catch (err) {
        // Data message/main wouldn't load into database.
        if (isProcessDebugVerbose) { console.log(err) }
        mainTrouble.main = true
        count.msgMnPces.final.failToDbProc++
        count.msgPieces.final.failToDbProc++
      }
    }
  }
  catch (err) {
    // Message wouldn't parse; not recognized as data-oriented.
    if (isProcessDebugVerbose) { console.log(err) }
    mainNonData.main = true
    count.msgMnPces.final.nonDataProc++
    count.msgPieces.final.nonDataProc++
  }
  count.msgMnPces.final.processed++
  count.msgPieces.final.processed++


  /**** Summary tallies. ****/

  if (mainAddedDbID.main !== null || Object.keys(partsAddedDbIDs).length > 0) {
    const newAddedPcsObj = {
      id: msgObj.gmailIDs.id,
      threadId: msgObj.gmailIDs.threadId,
      dbIDs: { ...mainAddedDbID, ...partsAddedDbIDs }
    }
    newAddedPcs.unshift(newAddedPcsObj)
  }

  if (mainDupDbID.main !== null || Object.keys(partsDupsDbIDs).length > 0) {
    const newDupMsgObj = {
      id: msgObj.gmailIDs.id,
      threadId: msgObj.gmailIDs.threadId,
      dbIDs: { ...mainDupDbID, ...partsDupsDbIDs }
    }
    dupPieces.unshift(newDupMsgObj)
  }

  let newTroubleMsgObj
  if (mainTrouble.main === true || Object.keys(partsTrouble.attch).length > 0) {
    if (Object.keys(partsTrouble.attch).length === 0) {
      newTroubleMsgObj = {
        id: msgObj.gmailIDs.id,
        threadId: msgObj.gmailIDs.threadId,
      }
    }
    else {
      newTroubleMsgObj = {
        id: msgObj.gmailIDs.id,
        threadId: msgObj.gmailIDs.threadId,
        parts: { main: mainTrouble.main, attch: partsTrouble.attch }
      }
    }
    newTroublePcs.unshift(newTroubleMsgObj)
  }

  let newNonDataMsgObj
  if (mainNonData.main === true || Object.keys(partsNonData.attch).length > 0) {
    if (Object.keys(partsNonData.attch).length === 0) {
      newNonDataMsgObj = {
        id: msgObj.gmailIDs.id,
        threadId: msgObj.gmailIDs.threadId,
      }
    }
    else {
      newNonDataMsgObj = {
        id: msgObj.gmailIDs.id,
        threadId: msgObj.gmailIDs.threadId,
        parts: { main: mainNonData.main, attch: partsNonData.attch }
      }
    }
    nonDataPcs.unshift(newNonDataMsgObj)
  }

  count.msgGmails.final.processed++


  tally = {
    reportsAdded, newAddedPcs, dupPieces, newTroublePcs, nonDataPcs, count
  }
  // Optional intermediate consistency check
  //count.isConsistent = checkCountConsistency(tally)
  //tally = { newAddedPcs, newTroublePcs, nonDataPcs, count }

  return tally
}


function reportIsDuplicate(reportObj, reportsAdded) {
  let isDuplicate = false
  const int = reportObj.reportDateInt
  const bay = reportObj.bay
  if (reportsAdded[int] && reportsAdded[int][`bay${bay}`]) {
    isDuplicate = true
  }
  return isDuplicate
}


function addMainToDups(reportObj, mainDupDbID, reportsAdded) {
  const int = reportObj.reportDateInt
  mainDupDbID.main = reportsAdded[int].dbID
}


function addPartToDups(part, reportObj, partsDupsDbIDs, reportsAdded) {
  const int = reportObj.reportDateInt
  partsDupsDbIDs[part.partId] = reportsAdded[int].dbID
}


function addReportToReportsAdded(record, reportsAdded) {
  const int = record.reportDateInt
  const bay = record.bay
  if (reportsAdded[int]) {
    checkThatBayPropertiesAreCorrect(bay, reportsAdded)
    reportsAdded[int][`bay${bay}`] = true
  }
  else {  // new report for this int/day
    if (bay === 1) {
      reportsAdded[int] = { dbID: record.id, bay1: true, bay2: false }
    }
    else if (bay === 2) {
      reportsAdded[int] = { dbID: record.id, bay1: false, bay2: true }
    }
    else {
      throw new Error('The `bay` record parameter has an unrecognized value.')
    }
  }
}

function checkThatBayPropertiesAreCorrect(reportsAdded, int, bay) {
  /* For a pre-existing entry in reportsAdded, where a new report for the same
  ** int is being added in bay n... */
  const errorMsg = 'Bad report records: a bay value is incorrect.'
  if (bay === 1) {
    if (
      reportsAdded[int].bay1 !== false && reportsAdded[int].bay2 !== true
    ) throw new Error(errorMsg)
  }
  else if (bay === 2) {
    if (
      reportsAdded[int].bay1 !== true && reportsAdded[int].bay2 !== false
    ) throw new Error(errorMsg)
  }
}



function updateCountTots(tally) {
  let dupPieces = tally.dupPieces
  let nonDataPcs = tally.nonDataPcs
  let count = tally.count

  count.msgMnPces.final.dupInDbTot = getNumMnPces(dupPieces)
  count.msgAttchs.final.dupInDbTot = getNumAttchs(dupPieces)
  count.msgPieces.final.dupInDbTot = getNumPieces(dupPieces)

  count.msgMnPces.final.nonDataTot = getNumMnPces(nonDataPcs)
  count.msgAttchs.final.nonDataTot = getNumAttchs(nonDataPcs)
  count.msgPieces.final.nonDataTot = getNumPieces(nonDataPcs)

  tally = { ...tally, nonDataPcs, count }

  return tally
}


function checkCountConsistency(tally) {
  let newAddedPcs = tally.newAddedPcs
  let newTroublePcs = tally.newTroublePcs
  let nonDataPcs = tally.nonDataPcs
  let count = tally.count

  checks = [
    // count is internally consistent:
    // --------------------------------------  --------------------------------------- + ---------------------------------- + ---------------------------------- + ---------------------------------- +
    { lhs: count.msgMnPces.final.processed,    rhs: count.msgMnPces.final.addedToDb    + count.msgMnPces.final.dupInDbProc  + count.msgMnPces.final.failToDbProc + count.msgMnPces.final.nonDataProc },
    { lhs: count.msgAttchs.final.processed,    rhs: count.msgAttchs.final.addedToDb    + count.msgAttchs.final.dupInDbProc  + count.msgAttchs.final.failToDbProc + count.msgAttchs.final.nonDataProc },
    { lhs: count.msgPieces.final.processed,    rhs: count.msgPieces.final.addedToDb    + count.msgPieces.final.dupInDbProc  + count.msgPieces.final.failToDbProc + count.msgPieces.final.nonDataProc },
    // --------------------------------------  --------------------------------------- + ---------------------------------- + ---------------------------------- + ---------------------------------- +
    { lhs: count.msgPieces.final.processed,    rhs: count.msgMnPces.final.processed    + count.msgAttchs.final.processed    },
    { lhs: count.msgPieces.final.addedToDb,    rhs: count.msgMnPces.final.addedToDb    + count.msgAttchs.final.addedToDb    },
    { lhs: count.msgPieces.final.dupInDbProc,  rhs: count.msgMnPces.final.dupInDbProc  + count.msgAttchs.final.dupInDbProc  },
    { lhs: count.msgPieces.final.dupInDbTot,   rhs: count.msgMnPces.final.dupInDbTot   + count.msgAttchs.final.dupInDbTot   },
    { lhs: count.msgPieces.final.failToDbProc, rhs: count.msgMnPces.final.failToDbProc + count.msgAttchs.final.failToDbProc },
    { lhs: count.msgPieces.final.nonDataProc,  rhs: count.msgMnPces.final.nonDataProc  + count.msgAttchs.final.nonDataProc  },
    { lhs: count.msgPieces.final.nonDataTot,   rhs: count.msgMnPces.final.nonDataTot   + count.msgAttchs.final.nonDataTot   },
    // --------------------------------------  --------------------------------------- + ---------------------------------- +
    { lhs: count.msgMnPces.final.nonDataTot,   rhs: count.msgMnPces.initial.nonDataTot + count.msgMnPces.final.nonDataProc },
    { lhs: count.msgAttchs.final.nonDataTot,   rhs: count.msgAttchs.initial.nonDataTot + count.msgAttchs.final.nonDataProc },
    { lhs: count.msgPieces.final.nonDataTot,   rhs: count.msgPieces.initial.nonDataTot + count.msgPieces.final.nonDataProc },
    // --------------------------------------  --------------------------------------- + ---------------------------------- +
    { lhs: count.msgMnPces.final.dupInDbTot,   rhs: count.msgMnPces.initial.dupInDbTot + count.msgMnPces.final.dupInDbProc },
    { lhs: count.msgAttchs.final.dupInDbTot,   rhs: count.msgAttchs.initial.dupInDbTot + count.msgAttchs.final.dupInDbProc },
    { lhs: count.msgPieces.final.dupInDbTot,   rhs: count.msgPieces.initial.dupInDbTot + count.msgPieces.final.dupInDbProc },
    // --------------------------------------  --------------------------------------- + ---------------------------------- +
    // count is consistent with other MnPces records:
    { lhs: count.msgMnPces.final.addedToDb,    rhs: getNumMnPces(newAddedPcs)                                               },
    { lhs: count.msgMnPces.final.failToDbProc, rhs: getNumMnPces(newTroublePcs)                                             },
    { lhs: count.msgMnPces.final.nonDataProc,  rhs: getNumMnPces(nonDataPcs)           - count.msgMnPces.initial.nonDataTot },
    // count is consistent with other Attchs records:
    { lhs: count.msgAttchs.final.addedToDb,    rhs: getNumAttchs(newAddedPcs)                                               },
    { lhs: count.msgAttchs.final.failToDbProc, rhs: getNumAttchs(newTroublePcs)                                             },
    { lhs: count.msgAttchs.final.nonDataProc,  rhs: getNumAttchs(nonDataPcs)           - count.msgAttchs.initial.nonDataTot },
    // count is consistent with other Pieces records:
    { lhs: count.msgPieces.final.addedToDb,    rhs: getNumPieces(newAddedPcs)                                               },
    { lhs: count.msgPieces.final.failToDbProc, rhs: getNumPieces(newTroublePcs)                                             },
    { lhs: count.msgPieces.final.nonDataProc,  rhs: getNumPieces(nonDataPcs)           - count.msgPieces.initial.nonDataTot }
  ]

  // Trouble-shooting examination:
  //console.dir(checks)
  //console.dir(count)

  const result = checks.reduce(
    (accum, el) => accum && (el.lhs === el.rhs),
    true
  )

  return result
}


/**
 * Comments for
 * getNumGmails (not enabled yet)(Gmails: search for whole message containers)
 * getNumPieces                  (Pieces: maximal search for all pieces)
 * getNumMnPces                  (MnPces: search for main msg content pieces)
 * getNumAttchs                  (Attchs: search for attachment/part pieces)
 * ----------------------------------------------------------------------------
 * `input` can come in 3 message list forms:  msgsList = [msgObj, msgObj, ..]
 *   1) (like in troubleMsgs or nonDataPcs)
 *      with  msgObj = { id/threadId, parts: { main: bool, attch: [..]} }
 *      or    msgObj = { id/threadId }
 *   2) (like in newAddedPcs)
 *      with  msgObj = { id/threadId, dbIDs: {main: #|null, '3': #, ..} }
 *   3) (like in messagesList)
 *      with  msgObj = { id/threadId, attachments: [..] }
 *      so    msgObj *does* contain a main msg
 *      and it either contains attachments or it does not
 */

function getNumGmails(input) {
  if (!Array.isArray(input)) {
    throw new Error('input should be an array, correct?')
  }
  else { // All input cases
    return input.length
  }
}

function getNumPieces(input) {
  if (!Array.isArray(input)) {
    throw new Error('input should be an array, correct?')
  }
  else if (input.length === 0) { // All input cases
    return 0
  }
  else if (input[0].attachments) { // Case 3 for input
    return input.reduce(
      (accum, msgObj) => accum + 1 + msgObj.attachments.length,
      0
    )
  }
  else if (input[0].dbIDs) { // Case 2 for input
    return input.reduce(
      (accum, msgObj) => {
        // don't count `main: null`
        const correction = (msgObj.dbIDs.main === null) ? 1 : 0
        const sum = Object.keys(msgObj.dbIDs).length - correction
        return accum + sum
      },
      0
    )
  }
  else { // Case 1 for input
    return input.reduce(
      (accum, msgObj) => {
        let sum
        if (msgObj.parts) {
          sum = msgObj.parts.main + msgObj.parts.attch.length
        }
        else {
          sum = 1
        }
        return accum + sum
      },
      0
    )
  }
}

function getNumMnPces(input) {
  if (!Array.isArray(input)) {
    throw new Error('input should be an array, correct?')
  }
  else if (input.length === 0) { // All input cases
    return 0
  }
  else if (input[0].attachments) { // Case 3 for input
    return input.reduce(
      (accum, msgObj) => accum + 1 + 0,
      0
    )
  }
  else if (input[0].dbIDs) { // Case 2 for input
    return input.reduce(
      (accum, msgObj) => {
        // don't count `main: null`
        const countMain = (msgObj.dbIDs.main === null) ? 0 : 1
        return accum + countMain
      },
      0
    )
  }
  else { // Case 1 for input
    return input.reduce(
      (accum, msgObj) => {
        let sum
        if (msgObj.parts) {
          sum = msgObj.parts.main + 0
        }
        else {
          sum = 1
        }
        return accum + sum
      },
      0
    )
  }
}

function getNumAttchs(input) {
  if (!Array.isArray(input)) {
    throw new Error('input should be an array, correct?')
  }
  else if (input.length === 0) { // All input cases
    return 0
  }
  else if (input[0].attachments) { // Case 3 for input
    return input.reduce(
      (accum, msgObj) => accum + 0 + msgObj.attachments.length,
      0
    )
  }
  else if (input[0].dbIDs) { // Case 2 for input
    return input.reduce(
      (accum, msgObj) => {
        // don't count `main` at all
        const sum = Object.keys(msgObj.dbIDs).length - 1
        return accum + sum
      },
      0
    )
  }
  else { // Case 1 for input
    return input.reduce(
      (accum, msgObj) => {
        let sum
        if (msgObj.parts) {
          sum = 0 + msgObj.parts.attch.length
        }
        else {
          sum = 0
        }
        return accum + sum
      },
      0
    )
  }
}


const processMsgExports = {
  getNumGmails, getNumPieces, getNumAttchs, getNumMnPces,
  updateCountTots, checkCountConsistency,
  simplifyHeaders, getRelevantAttachments, parseSaveAndTally
}

module.exports = processMsgExports