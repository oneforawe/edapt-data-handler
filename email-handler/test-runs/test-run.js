const path = require('path')
const PATH_TO_DB_API = path.resolve(__dirname, '../../database-api')
const {
  openDatabaseConnection,
  closeDatabaseConnection,
} = require(PATH_TO_DB_API + '/database-connection')
const feedModeToDatabaseAPI =
  require(PATH_TO_DB_API + '/db-api-mode/feed-mode-helper')
const updateDatabaseWithEmail = require('../update-db-w-email')

const databaseAPIisInExampleMode = false


/* Note: Before executing this file, you probably want to run the following
** command in the shell first (within the email-handler directory):
**    rm records/updates-stats.log records/email-*
** And you may want to drop (delete) the MySQL Reports table.
** Then you can execute this file:
**    node test-runs/test-run.js
*/

async function testRun() {
  await feedModeToDatabaseAPI(databaseAPIisInExampleMode, PATH_TO_DB_API)
  const { sequelize, Reports } =
    await openDatabaseConnection('Reports', PATH_TO_DB_API)
  await updateDatabaseWithEmail(Reports)
  await closeDatabaseConnection(sequelize)
}

testRun()