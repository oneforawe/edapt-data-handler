import {
  GET_FILE_START, GET_FILE_SUCCESS, GET_FILE_FAIL, SET_MESSAGE
} from './types'
import UserService from '../services/user.service'


export const getDbFile = (dbQueryObj) => (dispatch) => {
  dispatch({
    type: GET_FILE_START,
  })
  return UserService.getUserDbInfo(dbQueryObj)
    .then(data => {
      // Resolved
      dispatch({
        type: GET_FILE_SUCCESS,
        payload: { filename: data.filename },
      })
    })
    .catch(reason => {
      // Rejected
      const message =
        (reason.response &&
          reason.response.data &&
          reason.response.data.message) ||
        reason.message ||
        reason.toString()

      dispatch({
        type: GET_FILE_FAIL,
      })

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      })
    }
  )
}