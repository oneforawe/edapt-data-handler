'use strict';
const path = require('path')
const pathToDatabaseAPI  = path.resolve(__dirname, '../../database-api')
const pathToEmailHandler = path.resolve(__dirname, '../../email-handler')
const {
  openDatabaseConnection
} = require(pathToDatabaseAPI + '/database-connection')
const ensureDatabaseServerOn =
  require(pathToDatabaseAPI + '/ensure-db-server-running')
const updateDatabaseWithEmail =
  require(pathToEmailHandler + '/update-db-w-email')
const serverPort = process.argv[2].split('=')[1] // server-port=80 | =8080

let tableName, serverIsInDemoMode
if (process.argv.length >= 4) {
  if (process.argv[3] === 'demo') {
    tableName = 'Demo'
    serverIsInDemoMode = true
  }
}
else {
  tableName = 'Reports'
  serverIsInDemoMode = false
}


//debugging:
const fs = require('fs')


function startWebServer(dbConnection) {

  /* Create back-end node/express web server to manage interactions between web
  ** front-end client files/software and gui, MySQL database-api, and
  ** email-handler.  */
  const express = require('express')

  const app = express()

  // Parse JSON bodies for this app.
  app.use(express.json()); // must put this before route handlers

  // Serve static files.
  app.use(express.static(path.join(__dirname, '../client/build/')))

  // Simple route:
  // app.get('/', (req, res) => {
  //   res.json({ message: 'Welcome to EDAPT.' })
  // })
  // app.get('/', function(req, res) {
  //   res.sendFile(path.join(__dirname, '../client/build/index.html'))
  // })

  // Most get requests are served the master index page.
  const pathsRegExp = /^((?!\/api\/auth\/signin|\/api\/query).)*$/i
  /* All paths EXCEPT those containing '/api/auth/signin' or '/api/query' will
  ** be served the master index page. This is a little excessive, since all I
  ** need is to match all paths that are not these strings. */
  app.get(pathsRegExp, function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  })

  // routes
  require('./app/routes/auth.routes')(app)
  require('./app/routes/user.routes')(app, dbConnection)

  // Set port, listen for requests.
  const PORT = process.env.PORT || serverPort
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
}


function checkTimeToExecuteUpdate(dbCnxn) {
  const dateOption = { timeZone: 'America/Los_Angeles' }
  let now = (new Date()).toLocaleString('en-US', dateOption)
  now = new Date(now) // re-translate so time extraction is in proper time zone
  if (now.getHours() === 4 && now.getMinutes() === 0) {
    // if 4 AM, run update
    const { Reports } = dbCnxn
    updateDatabaseWithEmail(Reports)
  }
}

function setEmailIngestionTimer(dbCnxn) {
  // 59 second interval to ensure (at least) one time-check every minute
  setInterval(checkTimeToExecuteUpdate, 59 * 1000, dbCnxn)
}


async function startServerSideWebApp() {
  await ensureDatabaseServerOn()
  const dbConnection =
    await openDatabaseConnection(tableName, pathToDatabaseAPI)
  // pass database connection info (dbCnxn) to web server to enable queries
  startWebServer(dbConnection)
  // pass database connection info (dbCnxn) to email/database update timer
  if (!serverIsInDemoMode) {
    setEmailIngestionTimer(dbConnection)
  }
}


startServerSideWebApp()