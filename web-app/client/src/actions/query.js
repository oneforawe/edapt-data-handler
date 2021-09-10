import {
  QUERY_INPUT_SET, QUERY_START, QUERY_SUCCESS, QUERY_FAIL, SET_MESSAGE
} from './types'
import UserService from '../services/user.service'


export const setQueryInput = () => {

}

export const getQueryResults = (dbQueryObj) => (dispatch) => {
  dispatch({
    type: QUERY_START,
    payload: { query: dbQueryObj},
  })
  return UserService.getUserDbInfo(dbQueryObj)
    .then(data => {
      // Resolved
      dispatch({
        type: QUERY_SUCCESS,
        payload: { queryResult: data.queryResult },
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
        type: QUERY_FAIL,
      })

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      })
    }
  )
}