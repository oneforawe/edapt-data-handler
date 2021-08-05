const fs = require('fs')
const path = require('path')


// Each part of the web-app needs the mode value (in its own module-flavor)
async function feedModeToWebAppParts() {
  const readFilename = 'mode.json'
  const writeFilename = 'mode.js'
  let stringContent

  const {
    webAppIsInExampleMode: exampleMode,
    webAppIsInDemoMode: demoMode,
  } = JSON.parse(
    await fs.promises.readFile(__dirname + '/' + readFilename)
  )
  const pathToWebApp = path.resolve(__dirname, '..')

  // The web-app client (using React) needs the mode value in the src folder.
  stringContent = '' +
    `const clientIsInExampleMode = ${exampleMode}` + '\n' +
    `const clientIsInDemoMode = ${demoMode}`       + '\n\n\n' +
    `const clientModeExports = { clientIsInExampleMode, clientIsInDemoMode }` +
    '\n\n' +
    'module.exports = clientModeExports'
  await fs.promises.writeFile(
    `${pathToWebApp}/client/src/client-mode/${writeFilename}`,
    stringContent
  )

  stringContent = `const serverIsInExampleMode = ${exampleMode}` + '\n\n' +
    'module.exports = serverIsInExampleMode'
  await fs.promises.writeFile(
    `${pathToWebApp}/server/server-mode/${writeFilename}`,
    stringContent
  )

}


feedModeToWebAppParts()