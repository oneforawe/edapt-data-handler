import { GET_FILE_START, GET_FILE_SUCCESS, GET_FILE_FAIL } from '../actions/types'


const initialState = {
  isGettingFile: false,
  filename: null,
  getFileFailed: false,
}

export default function file(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_FILE_START:
      return {
        ...state,
        isGettingFile: true,
        filename: null,
        getFileFailed: false,
      }
    case GET_FILE_SUCCESS:
      return {
        ...state,
        isGettingFile: false,
        filename: payload.filename,
      }
    case GET_FILE_FAIL:
      return {
        ...state,
        isGettingFile: false,
        getFileFailed: true,
      }
    default:
      return state
  }
}