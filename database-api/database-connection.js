'use strict';
const { Sequelize } = require('sequelize')
const winston = require('winston')
const dbConfig = require('./config/dbConfig')
const PATH_TO_MODE = './db-api-mode/mode'


async function openDatabaseConnection(tableName, pathToDatabaseAPI) {

  /* LOGGER ******************************************************************/

  const logger = winston.createLogger({
    // REFERENCE:
    // Logging Levels (from most important to least, with ascending values)
    // const levels = {
    //   error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
    // }
    level: 'info', // log levels 'info' and lower-values
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      // Write all logs to `database.log`
      new winston.transports.File(
        { filename: pathToDatabaseAPI + '/database.log' }),
    ],
  });

  // When not in production mode, log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }  //  Does `process.env` work inside a function like this?


  /* Connection to MySQL *****************************************************/

  // declaring the connection instance
  const sequelize = new Sequelize(
    dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      dialect: dbConfig.driver,
      logging: msg => logger.debug(msg),
      freezeTableName: true, // enforce MySQL-table-name = modelName
    }
  )

  await sequelize.authenticate()
    .then(resolvedValue => {
      console.log('Sequelize database connection: opened successfully.\n')
    })
    .catch(rejectedReason => {
      throw new Error(`Sequelize database connection: ` +
        `FAILURE TO OPEN/CONNECT: ${rejectedReason}\n`)
    })


  /* Interact with MySQL database ********************************************/

  // Get db-api-mode
  const databaseAPIisInExampleMode = require(PATH_TO_MODE)

  // Pick a specific table (or model, in Sequelize terms); depending on mode.
  const { tableStructure } = databaseAPIisInExampleMode ?
    require('./config/table-example') : require('./config/table')

  /* Note: a model (class / table)
  ** enables creation (building & saving)
  ** of instances (objects / table rows/records) */

  /* Declare the model `Reports`, which is a class that extends the class
  ** `Model`, and define the modelName (specified by argument `tableName`) */
  const Reports = sequelize.define(tableName, tableStructure, {
    // Other model options go here
    tableName,         // associated MySQL database table name
    timestamps: true,  // automatic timestamps from sequelize
    // note: manual (non-sequelize) table updates will need manual timestamps
  });

  // Ensure table exists (either create or do nothing if it already exists)
  await Reports.sync()

  return {tableName, sequelize, Reports}
}


async function closeDatabaseConnection(connectionInstance) {
  return connectionInstance.close()
    .then(resolvedValue => {
      console.log('Sequelize database connection: closed successfully.\n')
      return Promise.resolve(resolvedValue)
    })
    .catch(rejectedReason => {
      console.error(`Sequelize database connection: ` +
        `FAILURE TO CLOSE: ${rejectedReason}\n`)
      return Promise.reject(rejectedReason)
    })
}


const dbExports = { openDatabaseConnection, closeDatabaseConnection }

module.exports = dbExports