const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/auth.config')
const userList = require('../config/users')


exports.signin = (req, res) => {
  try {
    const user = userList.find(user => user.username === req.query.username)

    if (!user) {
      return res.status(404).send({ message: 'User Not found.' })
    }

    const passwordIsValid = bcrypt.compareSync(
      req.query.password,
      user.passwordHash
    )

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid Password.' })
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    })

    res.status(200).send({
      id: user.id,
      username: user.username,
      accessToken: token
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message })
  }
}