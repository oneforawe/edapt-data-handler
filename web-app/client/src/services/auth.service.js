import axios from 'axios'


const API_URL = '/api/auth/'

const checkAddUserForLogin = async (username, password) => {
  // On the receiving end, the params will become the request.query.
  const requestConfig = { params: { username, password } }

  return axios.get(API_URL + 'signin', requestConfig)
    .then(response => {
      // Resolved
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      else {
        throw new Error('Unable to get user token.')
      }
      return Promise.resolve(response.data)
    })
    .catch(reason => {
      // Rejected
      return Promise.reject(reason)
    })
}

const removeUserForLogout = () => {
  localStorage.removeItem('user')
}


const authService = {
  checkAddUserForLogin,
  removeUserForLogout,
}

export default authService