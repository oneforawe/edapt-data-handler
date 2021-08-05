// Relative location of database api
const pathToDatabaseAPI = '../../../../database-api'
const getReportExample = require(pathToDatabaseAPI + '/database-tools-example')
const userDbInfoPractical = require('./user.controller')

const serverIsInExampleMode = require('../../server-mode/mode')


const userDbInfoExample = (dbConnection) => {
  return async (req, res) => {
    console.log('req.query')
    console.dir(req.query)
    let queryObj = req.query
    if (!queryObj) {
      res.status(500).send({ message: 'No query information.' })
    }
    const report = await getReportExample(dbConnection)
    res.status(200).send({ queryResult: JSON.stringify(report) })
  }
}


exports.userDbInfo =
  serverIsInExampleMode ? userDbInfoExample : userDbInfoPractical