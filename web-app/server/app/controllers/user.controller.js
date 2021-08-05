const pathToDatabaseAPI = '../../../../database-api'
const { queryTheDatabase } = require(pathToDatabaseAPI + '/database-tools')
//const getReport = require(pathToDatabaseAPI + '/database-tools')
const path = require('path')
const ObjectsToCsv = require('objects-to-csv')
const csvLocation = path.resolve(__dirname, '../../db-csv-file/')


const userDbInfoPractical = (dbConnection) => {
  return async (req, res) => {
    let queryObj = req.query
    if (!queryObj) {
      res.status(500).send({ message: 'No query information.' })
    }
    //const report = await getReport(dbConnection)
    if (queryObj.getDbFile) {
      // The user is requesting to download a csv file of the database info.
      try {
        const { table, today } = await queryTheDatabase(dbConnection, queryObj)
        const csv = new ObjectsToCsv(table)
        const csvFileName = `data.csv`
        const csvFileLocation = `${csvLocation}/${csvFileName}`
        await csv.toDisk(csvFileLocation)
        res.setHeader(
          'Content-disposition',
          `attachment; filename="${csvFileName}"`
        )
        res.set('Content-Type', 'text/csv')
        res.status(200).sendFile(csvFileLocation)
      }
      catch (err) {
        res.status(500).send({
          message: `File generation & retrieval failed: ${err}`
        })
      }
    }
    else {
      // The user is querying the database for specific info.
      try {
        const report = await queryTheDatabase(dbConnection, queryObj)
        res.status(200).send({ queryResult: JSON.stringify(report) })
      }
      catch (err) {
        res.status(500).send({ message: `Database query failed: ${err}` })
      }
    }
  }
}


module.exports = userDbInfoPractical