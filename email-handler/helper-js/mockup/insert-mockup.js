'use strict';
const reportMockup = require('./report-mockup')

// Relative location of database api
const locationDbAPI = '../../../database-api'
const {
  openDatabaseConnection,
  closeDatabaseConnection,
} = require(locationDbAPI + '/database-connection')

async function insertReportMockup() {
  const { sequelize, Reports } = await openDatabaseConnection(locationDbAPI)
  console.log('Inserting (or "creating") mockup report.\n')
  await Reports.create(reportMockup);
  await closeDatabaseConnection(sequelize)
}

insertReportMockup()