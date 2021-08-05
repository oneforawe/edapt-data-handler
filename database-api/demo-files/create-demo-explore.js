const path = require('path')
const {
  openDatabaseConnection,
  closeDatabaseConnection,
} = require('../database-connection')
const { getWholeTable } = require('../database-tools')
const feedModeToDatabaseAPI = require('../db-api-mode/feed-mode-helper')

const PATH_TO_DB_API = path.resolve(__dirname, '../')

const databaseAPIisInExampleMode = false


// Create Demo Table from Pre-Demo Table (normal company Reports)
async function createDemo() {
  await feedModeToDatabaseAPI(databaseAPIisInExampleMode, PATH_TO_DB_API)
  const { sequelize, Reports } =
    await openDatabaseConnection('PreDemo', PATH_TO_DB_API)

  // Using table named Demo.
  const wholeTableObj = await getWholeTable({ Reports })

  const categories = [
    'netMoneyCalc',
    'salesTotal',
    'salesCash',
    'salesCredit',
    'cashIn',
    'cashOut',
    'cashNet',
    'cashNotRefunded',
    'creditIn',
    'creditRefunds',
    'creditNet',
    'unitsWashTotal',
    'unitsWashCash',
    'unitsWashCredit',
    'unitsWashAccount',
    'unitsWashEmployee',
    'unitsWashW',
    'unitsWashP',
    'unitsWashD',
    'unitsWashE',
  ]
  let maxima = categories.map(category => ({ [category]: 0 }) )

  // get maxima over wholeTableObj
  wholeTableObj.forEach(report => {
    categories.forEach((category, index) => {
      if (
        parseFloat(report[category]) > parseFloat(maxima[index][category])
        &&
        parseFloat(report[category]) < 10000000
      ) {
        maxima[index][category] = report[category]
      }
    })
    if (report.id === 159) {
      console.log(`\nid=159; cashNet = ${report.cashNet}\n`)
    }
  })

  //console.dir(wholeTableObj)
  console.dir(maxima)
  console.log('')

  await closeDatabaseConnection(sequelize)
}


createDemo()