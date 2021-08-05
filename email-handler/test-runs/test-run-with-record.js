const path = require('path')
const PATH_TO_DB_API = path.resolve(__dirname, '../../database-api')
const {
  openDatabaseConnection,
  closeDatabaseConnection,
} = require(PATH_TO_DB_API + '/database-connection')
const feedModeToDatabaseAPI =
  require(PATH_TO_DB_API + '/db-api-mode/feed-mode-helper')
const updateDatabaseWithRecord = require('../update-db-w-record')

const databaseAPIisInExampleMode = false


async function testRunWithRecord() {
  await feedModeToDatabaseAPI(databaseAPIisInExampleMode, PATH_TO_DB_API)
  const { sequelize, Reports } =
    await openDatabaseConnection('Reports', PATH_TO_DB_API)
  await updateDatabaseWithRecord(Reports)
  await closeDatabaseConnection(sequelize)
}

testRunWithRecord()