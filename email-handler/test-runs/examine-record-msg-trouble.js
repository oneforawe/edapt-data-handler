'use strict';
const fs = require('fs')
const {
  assureFile, assureJSONfile, getJSONobject, setJSONobject
} = require('../helper-js/file-interact')
const path = require('path')
const PATH_TO_DB_API = path.resolve(__dirname, '../../database-api')
const {
  openDatabaseConnection,
  closeDatabaseConnection,
} = require(PATH_TO_DB_API + '/database-connection')
const feedModeToDatabaseAPI =
  require(PATH_TO_DB_API + '/db-api-mode/feed-mode-helper')
const updateDatabaseWithRecord = require('../update-db-w-record')
const { parseEmailMsg } = require('../helper-js/parse-email-msg')

const util = require('util')


const databaseAPIisInExampleMode = false


// async function testRunWithRecord() {
//   await feedModeToDatabaseAPI(databaseAPIisInExampleMode, PATH_TO_DB_API)
//   const { sequelize, Reports } = await openDatabaseConnection(PATH_TO_DB_API)
//   await examineOneRecordMsg(Reports)
//   await closeDatabaseConnection(sequelize)
// }
// testRunWithRecord()


async function examineOneRecordMsg() {

  const lastMsgsRecordsFileName =
    path.resolve(__dirname, '../records/last-msgs-list-bsn-2.json')
    //path.resolve(__dirname, '../records/last-msgs-list.json')
  try { await fs.promises.access(lastMsgsRecordsFileName) }
  catch (error) { throw new Error('No record to examine messages with.') }
  const messagesList = await getJSONobject(lastMsgsRecordsFileName)

  // mis-parsed messages: index = 84, 107, 766
  const msg0 = messagesList[84]
  const msg1 = messagesList[107]
  const msg2 = messagesList[766]
  //console.log(msg)
  //console.log(messagesList[0]) // message with report attachments
  //console.log(util.inspect(messagesList[0], false, null, true /* enable colors */))

  //const { reportObj, bodyArray, bodyString } = await parseEmailMsg(msg)
  // edited parseEmailMsg to return reportObj.gmailIDs
  const ids0 = await parseEmailMsg(msg0)
  const ids1 = await parseEmailMsg(msg1)
  const ids2 = await parseEmailMsg(msg2)

  const idsList = [ids0, ids1, ids2]
  //console.log(util.inspect(bodyArray, false, null, true /* enable colors */))
  //console.log(util.inspect(reportObj, false, null, true /* enable colors */))
  console.log(util.inspect(idsList, false, null, true /* enable colors */))

  //const examFileName = 'emailMsg5.txt'
  const examFileName = 'oldTroubleMsgs-20210706.json'
  await assureFile(examFileName)
  //await fs.promises.writeFile(examFileName, bodyString)
  await fs.promises.writeFile(examFileName, JSON.stringify(idsList))

  // From business account:
  //const bodyArray = await parseEmailMsg(messagesList[1])
  //console.dir(messagesList[0])
  //console.log(util.inspect(bodyArray, false, null, true /* enable colors */))

}


examineOneRecordMsg()