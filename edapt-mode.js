/**
 *  Set mode of EDAPT app
 *  via `appIsInExampleMode`.
 *
 *  Set to either 1) `true` for example-mode,
 *                    which uses example files,
 *             or 2) `false` for practical-mode,
 *                    which uses files tuned for specific business application.
 *
 *  The practical-mode files are hidden in the github repo (via .gitignore).
 */


const appIsInExampleMode = false

let appIsInDemoMode
if (process.argv.length >= 3) {
  if (process.argv[2] === 'demo') {
    appIsInDemoMode = true
  }
}
else {
  appIsInDemoMode = false
}

const twoModes = { appIsInExampleMode, appIsInDemoMode }

/**
 *  Only two of the three major parts of the app have an example mode, and when
 *  the parts are used as a whole these two modes need to agree.
 *  Only one of the three major parts of the app have a demo mode.
 */

async function setModeAcrossApp() {
  // The database-api needs the mode value
  const pathToDatabaseAPI = './database-api'
  const pathToDatabaseAPIhelper =
    `${pathToDatabaseAPI}/db-api-mode/feed-mode-helper`
  const feedModeToDatabaseAPI = require(pathToDatabaseAPIhelper)
  await feedModeToDatabaseAPI(appIsInExampleMode, pathToDatabaseAPI)

  // The web-app needs the mode value
  const pathToWebApp = './web-app'
  const pathToWebAppHelper =
    `${pathToWebApp}/web-app-mode/feed-mode-helper`
  const feedModeToWebApp = require(pathToWebAppHelper)
  await feedModeToWebApp(twoModes, pathToWebApp)
}

setModeAcrossApp()