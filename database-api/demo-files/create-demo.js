const path = require('path')
const {
  openDatabaseConnection,
  closeDatabaseConnection,
} = require('../database-connection')
const { getWholeTable } = require('../database-tools')
const feedModeToDatabaseAPI = require('../db-api-mode/feed-mode-helper')
const { checkReportConsistency } =
  require('../../email-handler/helper-js/parse-email-msg')
const poisson = require('@stdlib/random-base-poisson')
// see https://github.com/stdlib-js/random-base-poisson

const PATH_TO_DB_API = path.resolve(__dirname, '../')

const databaseAPIisInExampleMode = false


// Create Demo Table from Pre-Demo Table (normal company Reports)
async function createDemo() {

  await feedModeToDatabaseAPI(databaseAPIisInExampleMode, PATH_TO_DB_API)

  const { sequelize: sequelizePreDemo, Reports: ReportsPreDemo } =
    await openDatabaseConnection('PreDemo', PATH_TO_DB_API)
  const wholeTableObj = await getWholeTable({ Reports: ReportsPreDemo })
  await closeDatabaseConnection(sequelizePreDemo)

  const { sequelize, Reports } =
    await openDatabaseConnection('Demo', PATH_TO_DB_API)
  // Clear / "truncate" table Demo (referred to here as Reports)
  Reports.destroy({
    where: {},
    truncate: true
  })

  const categories = [
    //'id',                 // delete (regenerate when adding to new database)
    'reportDateInt',        // la
    'reportForDate',        // la
    'reportForWeekday',     // la
    'reportSendDate',       // la
    'gmailMsgDate',         // la
    'reportIsConsistent',   // recalculate  at end of iteration
    'bay',                  // la
    'netMoneyCalc',         // calculate    at end of iteration
    'salesTotal',           // calculate    at end of iteration
    'salesCash',            // calculate
    'salesCredit',          // calculate
    'cashIn',               // make sure greater than cashOut + cashNotRefunded
    'cashOut',              // la
    'cashNet',              // calculate
    'cashNotRefunded',      // la
    'creditIn',             // calculate
    'creditRefunds',        // calculate
    'creditNet',            // calculate
    'unitsWashTotal',       // count        at end of iteration
    'unitsWashCash',        // count
    'unitsWashCredit',      // count
    'unitsWashAccount',     // count
    'unitsWashEmployee',    // count
    'unitsWashW',           // generate (w/ portions cash/credit/account)
    'unitsWashP',           // generate (w/ portions cash/credit/account)
    'unitsWashD',           // generate (w/ portions cash/credit/account)
    'unitsWashE',           // generate (w/ portions cash/credit/account)
    //'createdAt',          // delete (regenerate when adding to new database)
    //'updatedAt',          // delete (regenerate when adding to new database)
  ]

  const washTypes = [
    { type: 'unitsWashW', price: 10 },
    { type: 'unitsWashP', price: 13 },
    { type: 'unitsWashD', price: 16 },
    { type: 'unitsWashE', price: 7 },
  ]

  // Probabilistic parameters
  const avg = 12 // ~ Poisson average
  const cashUsedOptions = [...Array(Math.floor(avg/2)).fill(false), true]
  const accountUsedOptions = [...Array(avg).fill(false), true]
  const employeeUsedOptions = [...Array(avg).fill(false), true]


  let cashAmt, creditAmt, accountAmt

  for (let report of wholeTableObj) {

    const reportObj = { ...report }

    delete reportObj.id
    delete reportObj.createdAt
    delete reportObj.updatedAt

    reportObj.unitsWashTotal = 0
    reportObj.unitsWashCash = 0
    reportObj.unitsWashCredit = 0
    reportObj.unitsWashAccount = 0
    reportObj.unitsWashEmployee = 0
    reportObj.unitsWashW = 0
    reportObj.unitsWashP = 0
    reportObj.unitsWashD = 0
    reportObj.unitsWashE = 0

    reportObj.netMoneyCalc  = 0
    reportObj.salesTotal    = 0
    reportObj.salesCash     = 0
    reportObj.salesCredit   = 0
    reportObj.cashIn        = 0
    //reportObj.cashOut       (keep as is)
    reportObj.cashNet       = 0
    //reportObj.cashRefunded  (keep as is)
    reportObj.creditIn      = 0
    reportObj.creditRefunds = 0
    reportObj.creditNet     = 0


    washTypes.forEach(washType => {

      // for this type of wash (W, P, D, E)...
      let numUnitsCashAndCredit = 31 // above max 30 to trigger calculation
      let numUnitsCash = 0,    numUnitsCredit = 0
      let numUnitsAccount = 0, numUnitsEmployee = 0

      while (numUnitsCashAndCredit > 30) {
        numUnitsCashAndCredit = poisson(avg)
      }
      reportObj[washType.type] += numUnitsCashAndCredit

      // cash      for this type of wash (W, P, D, E)
      for (let i = 1; i <= numUnitsCashAndCredit; i++) {
        numUnitsCash += pickRandom(cashUsedOptions) ? 1 : 0
      }
      reportObj.unitsWashCash += numUnitsCash
      cashAmt = numUnitsCash * washType.price
      reportObj.cashIn += cashAmt
      reportObj.salesCash += cashAmt
      reportObj.salesTotal += cashAmt

      // credit    for this type of wash (W, P, D, E)
      numUnitsCredit = numUnitsCashAndCredit - numUnitsCash
      reportObj.unitsWashCredit += numUnitsCredit
      creditAmt = numUnitsCredit * washType.price
      reportObj.creditIn += creditAmt
      reportObj.creditNet += creditAmt
      reportObj.salesCredit += creditAmt
      reportObj.salesTotal += creditAmt

      // account   for this type of wash (W, P, D, E)
      for (let i = 1; i <= 3; i++) {
        numUnitsAccount += pickRandom(accountUsedOptions) ? 1 : 0
      }
      reportObj[washType.type] += numUnitsAccount
      reportObj.unitsWashAccount += numUnitsAccount
      accountAmt = numUnitsAccount * washType.price
      reportObj.creditRefunds += accountAmt
      //reportObj.salesCredit += accountAmt
      //reportObj.salesTotal += accountAmt

      // employee  for this type of wash (W, P, D, E)
      for (let i = 1; i <= 1; i++) {
        numUnitsEmployee += pickRandom(employeeUsedOptions) ? 1 : 0
      }
      reportObj.unitsWashEmployee += numUnitsEmployee
      reportObj[washType.type] += numUnitsEmployee

    })

    reportObj.unitsWashTotal =
      reportObj.unitsWashW + reportObj.unitsWashP +
      reportObj.unitsWashD + reportObj.unitsWashE

    reportObj.cashIn +=
      parseInt(reportObj.cashOut) + parseInt(reportObj.cashNotRefunded)

    reportObj.cashNet = reportObj.cashIn - parseInt(reportObj.cashOut)

    reportObj.netMoneyCalc = reportObj.salesTotal +
      parseInt(reportObj.cashNotRefunded)

    // convert numbers to strings (as they should be in email sales reports)
    reportObj.netMoneyCalc  = `${reportObj.netMoneyCalc}.00`
    reportObj.salesTotal    = `${reportObj.salesTotal}.00`
    reportObj.salesCash     = `${reportObj.salesCash}.00`
    reportObj.salesCredit   = `${reportObj.salesCredit}.00`
    reportObj.cashIn        = `${reportObj.cashIn}.00`
    //reportObj.cashOut       = `${reportObj.cashOut}.00`      (already string)
    reportObj.cashNet       = `${reportObj.cashNet}.00`
    //reportObj.cashRefunded  = `${reportObj.cashRefunded}.00` (already string)
    reportObj.creditIn      = `${reportObj.creditIn}.00`
    reportObj.creditRefunds = `${reportObj.creditRefunds}.00`
    reportObj.creditNet     = `${reportObj.creditNet}.00`

    const reportCheckObj = {
      bayCheck:           reportObj.bay,
      bay:                reportObj.bay,
      netMoneyCalc:       reportObj.netMoneyCalc,
      salesTotal:         reportObj.salesTotal,
      salesCash:          reportObj.salesCash,
      salesCredit:        reportObj.salesCredit,
      cashIn:             reportObj.cashIn,
      cashOut:            reportObj.cashOut,
      cashNet:            reportObj.cashNet,
      cashNotRefunded:    reportObj.cashNotRefunded,
      creditIn:           reportObj.creditIn,
      creditRefunds:      reportObj.creditRefunds,
      creditNet:          reportObj.creditNet,
      unitsWashTotal:     reportObj.unitsWashTotal,
      unitsWashCash:      reportObj.unitsWashCash,
      unitsWashCredit:    reportObj.unitsWashCredit,
      unitsWashAccount:   reportObj.unitsWashAccount,
      unitsWashEmployee:  reportObj.unitsWashEmployee,
      unitsWashW:         reportObj.unitsWashW,
      unitsWashP:         reportObj.unitsWashP,
      unitsWashD:         reportObj.unitsWashD,
      unitsWashE:         reportObj.unitsWashE,
    }

    const {
      reportIsConsistent, consistencyArray, consistencyCheckArray
    } = checkReportConsistency(reportCheckObj)

    reportObj.reportIsConsistent = reportIsConsistent

    // debug:
    // console.log(reportObj)
    // console.log('')
    // console.log(consistencyCheckArray)
    // console.log('')

    record = await Reports.create(reportObj)
    // break
  }

  await closeDatabaseConnection(sequelize)
}


function pickRandom(arr) {
  const len = arr.length
  const index = Math.floor(len * Math.random())
  return arr[index]
}


createDemo()