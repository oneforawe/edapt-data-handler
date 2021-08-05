const path = require('path')
const { PROJ_NAME } = require('./project-name')


// Reference
const REF_PATH     = path.resolve(__dirname, './')
const REL_REF_PATH = `${PROJ_NAME}/reference`

// Authorization
const AUTH_PATH     = path.resolve(__dirname, '../auth/')
const AUTH_LOG_PATH = path.resolve(__dirname, '../auth/auth.log')
const AUTH_OLD_PATH = path.resolve(__dirname, '../auth/old-tokens/')
const CREDS_PATH    = path.resolve(__dirname, '../auth/credentials.json')
const TOKEN_PATH    = path.resolve(__dirname, '../auth/token.json')

// Email label-ensuring
const REL_ENSURE_PATH = `${PROJ_NAME}/helper-js/ensure-labels.js`


module.exports = {
  REF_PATH,
  REL_REF_PATH,
  AUTH_PATH,
  AUTH_LOG_PATH,
  AUTH_OLD_PATH,
  CREDS_PATH,
  TOKEN_PATH,
  REL_ENSURE_PATH,
}