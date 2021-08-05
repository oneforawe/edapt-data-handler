import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SET_MESSAGE } from './types'
import AuthService from '../services/auth.service'


export const login = (username, password) => (dispatch) => {
  dispatch({
    type: LOGIN_START,
  })
  return AuthService.checkAddUserForLogin(username, password)
    .then(data => {
      // Resolved
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data },
      })
    })
    .catch((reason) => {
      // Rejected
      const message =
        (reason.response &&
          reason.response.data &&
          reason.response.data.message) ||
        reason.message ||
        reason.toString()

      dispatch({
        type: LOGIN_FAIL,
      })

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      })
    })
}

export const logout = () => (dispatch) => {
  AuthService.removeUserForLogout()
  dispatch({ type: LOGOUT })
}