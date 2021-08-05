import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/types'


const user = JSON.parse(localStorage.getItem('user'))

const initialState = user
  ? { isLogginIn: false, isLoggedIn: true, user }
  : { isLogginIn: false, isLoggedIn: false, user: null }


export default function auth(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case LOGIN_START:
      return {
        ...state,
        isLoggingIn: true,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        user: payload.user,
      }
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
        user: null,
      }
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      }
    default:
      return state
  }
}