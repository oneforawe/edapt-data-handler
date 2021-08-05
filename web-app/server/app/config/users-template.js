/* In usage, rename this file as `users.js` and do not include passwords; only
 * include password hashes, created with the `add-user.js` file. */

const userList = [
  {
    id: 0,
    username: 'theuser',
    password: 'thepassword',  // delete this line when in usage
    passwordHash: '$2a$10$5Yj/iYcQhcvF7GTBeNYf0.ERHGIgRtJukOWEyKWzKCbQixy66ZxWm',
  }
]

module.exports = userList