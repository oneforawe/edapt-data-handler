import { QUERY_START, QUERY_SUCCESS, QUERY_FAIL } from '../actions/types'
import initialState from './queryInit'


export default function query(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case QUERY_START:
      return {
        ...state,
        isQuerying: true,
        query: payload.query,
        queryResult: null,
        queryFailed: false,
      }
    case QUERY_SUCCESS:
      return {
        ...state,
        isQuerying: false,
        queryResult: payload.queryResult,
      }
    case QUERY_FAIL:
      return {
        ...state,
        isQuerying: false,
        queryFailed: true,
      }
    default:
      return state
  }
}