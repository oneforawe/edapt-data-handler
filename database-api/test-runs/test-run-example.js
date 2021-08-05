const path = require('path')
const {
  openDatabaseConnection,
  closeDatabaseConnection,
} = require('../database-connection')
const getReportExample = require('../database-tools-example')
const feedModeToDatabaseAPI = require('../db-api-mode/feed-mode-helper')

const PATH_TO_DB_API = path.resolve(__dirname, '../')

const databaseAPIisInExampleMode = true


async function testRun() {
  await feedModeToDatabaseAPI(databaseAPIisInExampleMode, PATH_TO_DB_API)
  const { sequelize, Reports } =
    await openDatabaseConnection('Users', PATH_TO_DB_API)

  // Clear / "truncate" table Users (referred to here as Reports)
  // See database-api/config/table-example.js for declaration of name of table.
  Reports.destroy({
    where: {},
    truncate: true
  })

  const jane = await Reports.create({ firstName: "Jane" });
  // Jane exists in the database now!
  // console.log(jane instanceof Users); // true
  // console.log(jane.firstName); // "Jane"

  // console.log(jane.toJSON()); // This is good!
  // console.log(JSON.stringify(jane, null, 4)); // This is also good!

  const report = await getReportExample(Reports)
  console.log('report:')
  console.dir(report)
  console.log('')

  await closeDatabaseConnection(sequelize)
}


testRun()