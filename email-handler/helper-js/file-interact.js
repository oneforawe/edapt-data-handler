const fs = require('fs')


async function assureFile(filename, stringGenerator) {
  try { await fs.promises.access(filename) }
  catch (error) {
    if (stringGenerator) {
      await fs.promises.writeFile(filename, stringGenerator())
    }
    else {
      await fs.promises.writeFile(filename, '')
    }
  }
}

async function assureJSONfile(filename, stringGenerator) {
  try { await fs.promises.access(filename) }
  catch (error) {
    if (stringGenerator) {
      await fs.promises.writeFile(filename, stringGenerator())
    }
    else {
      await fs.promises.writeFile(filename, '{}')
    }
  }
}

async function getJSONobject(filename) {
  let jsonObjectString, jsonObject
  try { jsonObjectString = await fs.promises.readFile(filename) }
  catch (error) { throw new Error(`Error reading file: ${error}`) };
  jsonObject = JSON.parse(jsonObjectString)
  return jsonObject
}

async function setJSONobject(filename, jsonObject) {
  try { await fs.promises.writeFile(filename, JSON.stringify(jsonObject)) }
  catch (err) { throw new Error(`Error writing to JSON file: ${err.message}`) }
}

function appendJSONobject(filename) {
}


const fileJSONinteractExports = {
  assureFile, assureJSONfile, getJSONobject, setJSONobject, appendJSONobject
}

module.exports = fileJSONinteractExports