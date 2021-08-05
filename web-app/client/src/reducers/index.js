import { combineReducers } from 'redux'
import auth from './auth'
import message from './message'
import file from './file'
import query from './query'

export default combineReducers({
  auth,
  message,
  file,
  query,
})