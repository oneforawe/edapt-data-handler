import {
  QUERY_INPUT_SET, QUERY_START, QUERY_SUCCESS, QUERY_FAIL
} from '../actions/types'
import queryInputInit from './queryInputInit'


const initialState = {
  queryInput: queryInputInit,
  isQuerying: false,
  query: null,
  queryResult: null,
  queryFailed: false,
}


export default function query(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case QUERY_INPUT_SET:
      return {
        ...state,
        queryInput: payload.queryInput,
      }
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