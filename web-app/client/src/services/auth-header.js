export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user && user.accessToken) {
    // for Node.js Express back-end with JWT (JSON Web Tokens)
    return { 'x-access-token': user.accessToken }
  } else {
    return {}
  }
}