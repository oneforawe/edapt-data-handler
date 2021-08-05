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
    path.resolve(__dirname, '../records/last-msgs-list-bsn-3.json')
    //path.resolve(__dirname, '../records/last-msgs-list.json')
  try { await fs.promises.access(lastMsgsRecordsFileName) }
  catch (error) { throw new Error('No record to examine messages with.') }
  const messagesList = await getJSONobject(lastMsgsRecordsFileName)

  // inconsistent messages:
  // const msg0 = messagesList[?]
  //console.log(msg)
  //console.log(messagesList[0]) // message with report attachments
  //console.log(util.inspect(messagesList[0], false, null, true /* enable colors */))


  const examFileName = 'emailMsg.txt'
  await assureFile(examFileName)


  // See all the inconsistencies:
  for (let [index, msg] of messagesList.entries()) {
    //console.log(msg)
    try {
      const { reportObj, bodyString } = await parseEmailMsg(msg)
      if (index === 66) {
        console.log(bodyString)
        await fs.promises.writeFile(examFileName, bodyString)
      }
      // console.log(
      //   `${index}\t` +
      //   `${reportObj.reportForDate}\t` +
      //   `${reportObj.bay}\t` +
      //   `${reportObj.reportIsConsistent}\t`
      // )
    }
    catch (err) {
      //console.log(err)
    }
  }

  // Examine one inconsistent message:
  // (eg, index 29, 37, 74)
  // let index = 84
  // const { reportObj, consistencyCheckArray, consistencyArray, bodyString }
  //   = await parseEmailMsg(messagesList[index])
  // console.log(
  //   `${index}\t` +
  //   `${reportObj.reportForDate}\t` +
  //   `${reportObj.bay}\t` +
  //   `${reportObj.reportIsConsistent}\t` +
  //   `${consistencyArray}`
  // )
  // console.log(consistencyCheckArray)
  // console.log(reportObj)
  // console.log(bodyString)

}


// For index 29
// F  (cents(cashNet) === cents(salesCash) + cents(cashNotRefunded)),
// F  (cents(creditNet) === cents(creditIn) - cents(creditRefunds)),
// F  (cents(salesTotal) === cents(cashIn) - cents(cashNotRefunded)
//      - cents(cashOut) + cents(creditIn) - cents(creditRefunds)),
// F  (cents(netMoneyCalc) === cents(salesTotal) + cents(cashNotRefunded)),


examineOneRecordMsg()