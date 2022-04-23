const models = require('@risecorejs/core/models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// SIGN-UP
exports.signUp = async (req, res) => {
  const errors = await req.validator({
    email: 'required|email|max:200|unique:user',
    password: 'required|string|between:8-200',
    passwordConfirm: 'required|as:password'
  })

  if (errors) {
    return res.status(400).json({ errors })
  }

  const fields = req.only('email', 'password')

  const instance = await models.User.create(fields)

  const user = instance.toJSON()

  delete user.password

  return res.status(201).json({ user })
}

// SIGN-IN
exports.signIn = async (req, res) => {
  const errors = await req.validator({
    email: 'required|email',
    password: 'required|string'
  })

  if (errors) {
    return res.status(400).json({ errors })
  }

  const user = await models.User.findOne({
    where: {
      email: req.body.email
    }
  })

  if (!user) {
    return res.sendStatus(401)
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password)

  if (!passwordMatch) {
    return res.sendStatus(401)
  }

  const accessToken = jwt.sign({ userId: user.id }, $env('JWT_SECRET_KEY'), {
    expiresIn: $env('JWT_EXPIRES_IN')
  })

  return res.json({ accessToken })
}
