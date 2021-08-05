import axios from 'axios'
import qs from 'qs'
import authHeader from './auth-header'
import fileDownload from 'js-file-download'
import moment from 'moment'


const API_URL = '/api/'

const getUserDbInfo = (queryObj) => {

  let extraOption
  if (queryObj.getDbFile) {
    // If downloading a csv file, response data must be a 'blob'.
    extraOption = { responseType: 'blob' }
  }
  else {
    extraOption = {}
  }

  // On the receiving end, the params will become the request.query.
  const requestConfig = {
    headers: authHeader(),
    ...extraOption,
    params: queryObj,
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'brackets'})
    },
  }

  if (queryObj.getDbFile) {
    return axios.get(API_URL + 'query', requestConfig)
      .then(response => {
        // Resolved
        const today = queryObj.today
        const responseFileName = `database-copy-${localDateStamp(today)}.csv`
        fileDownload(response.data, responseFileName)
        return Promise.resolve({ filename: responseFileName })
      })
      .catch(reason => {
        // Rejected
        return Promise.reject(reason)
      })
  }
  else {
    return axios.get(API_URL + 'query', requestConfig)
      .then(response => {
        // Resolved
        return Promise.resolve(response.data)
      })
      .catch(reason => {
        // Rejected
        return Promise.reject(reason)
      })
  }
}


function localDateStamp(dateStamp) {
  return `${moment(dateStamp).format(`YYYY-MM-DD`)}`
}


const userService = {
  getUserDbInfo,
}

export default userService