const fs = require('fs')
const { authorize } = require('./acct-and-auth')
const { getLabelIDs } = require('./gmail-api')

const filename = 'auto-gen-label-ids.js'
const { REF_PATH, REL_REF_PATH, REL_ENSURE_PATH } = require('../reference/paths')
const { MAIN_FILE, EMAIL_INFO } = require('../reference/file-names')
const PATH_TO_LABEL_IDS = `${REF_PATH}/${filename}`


/**
 * Ensure label IDs are saved in a file (so if they're not there, get them and
 * save them), and then return them.
 * @param {object} creds - google.auth.OAuth2 authorization client credentials.
 * @param {array} labelsRequire - Array of strings, which are email label names
 * from the user's gmail account.  Retrieved messages are required to have all
 * of these labels.
 */
async function ensureAndGetLabelIDs(creds, labelsRequire) {
  let needRefresh, labelIDsRequireSaved
  try {
    await fs.promises.access(PATH_TO_LABEL_IDS)
    labelIDsRequireSaved = require(PATH_TO_LABEL_IDS)
  }
  catch (error) {
    // either way, we'll check to see if the saved list equals the current list
  }
  // current list
  labelIDsRequire =
    await authorize(creds, getLabelIDs, labelsRequire, 'getLabelIDs')

  if (notEqual(labelIDsRequireSaved, labelIDsRequire)) {
    needRefresh = true
    await fs.promises.writeFile(PATH_TO_LABEL_IDS,
      `/**\n` +
      ` * This file is auto-generated (by \`${REL_ENSURE_PATH}\`)\n` +
      ` * when running the main function (in \`${MAIN_FILE}\`).\n` +
      ` * It's derived from the info in \`${REL_REF_PATH}/${EMAIL_INFO}\`.\n` +
      ` */\n\n` +
      `module.exports = ${generateArrayString(labelIDsRequire)}`
    )

  }
  else {
    needRefresh = false
  }

  return { needRefresh, labelIDsRequire }
}


function notEqual(saved, current) {
  // "not equal", specifically for these label ID arrays
  if (saved === undefined)   { return true }
  if (!Array.isArray(saved)) { return true }
  if (Array.isArray(saved) && saved.length !== current.length) {
    return true
  }
  for (let [index,value] of saved.entries()) {
    if (value !== current[index]) { return true }
  }
  return false
}

function generateArrayString(arr) {
  if (arr.length === 0) {
    return '[]'
  }
  else {
    return `['${arr.join(`','`)}']`
  }
}


module.exports = ensureAndGetLabelIDs