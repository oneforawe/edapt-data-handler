const fs = require('fs')


function feedModeToWebApp(twoModes, pathToWebApp) {
  const { appIsInExampleMode, appIsInDemoMode } = twoModes
  const filename = 'mode.json'
  const stringContent = '{' + '\n' +
    `  "webAppIsInExampleMode": "${appIsInExampleMode}",` + '\n' +
    `  "webAppIsInDemoMode": "${appIsInDemoMode}"`        + '\n' +
    '}'
  fs.writeFileSync(
    `${pathToWebApp}/web-app-mode/${filename}`,
    stringContent
  )
}


module.exports = feedModeToWebApp