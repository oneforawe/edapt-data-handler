const fs = require('fs')


async function feedModeToDatabaseAPI(mode, pathToDatabaseAPI) {
  const filename = 'mode.js'
  const stringContent = `const databaseAPIisInExampleMode = ${mode}` + '\n\n' +
    'module.exports = databaseAPIisInExampleMode'
  await fs.promises.writeFile(
    `${pathToDatabaseAPI}/db-api-mode/${filename}`,
    stringContent
  )
}


module.exports = feedModeToDatabaseAPI