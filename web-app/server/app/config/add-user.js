/**
 * Usage: Edit the `username` string and `password` string below for the
 *        desired new or replacement user.
 *        Execute `node add-user.js` in the shell and it will print out a new
 *        user object at the end of the `users.js` file.
 *        Then edit the `users.js` file so that the object is placed inside the
 *        array of users, potentially deleting any newly created redundancies.
 *        Pick and enter/edit an id number for the new/replacement user.
 */

const bcrypt = require('bcryptjs')
const fs = require('fs')

const username = '' // put username string here, then delete when done
const password = '' // put password string here, then delete when done
const usersFile = './users.js'
const saltRounds = 10

bcrypt.genSalt(saltRounds, function(err, salt) {
  bcrypt.hash(password, salt, function(err, passwordHash) {
    // Store passwordHash in your password DB.
    userObjString = `\n\n` +
      `// Move the object below into the array above ` +
      `and delete this instruction.\n` +
      `{\n  id: '<enter a sensible (non-string) number here>',` +
      `\n  username: '${username}',\n  passwordHash: '${passwordHash}',\n}`
    fs.appendFile(usersFile, userObjString, (err) => {
      if (err) console.log(err)
    })
  })
})