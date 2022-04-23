const jwt = require('jsonwebtoken')
const models = require('@risecorejs/core/models')

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw { message: 'Access token was not passed in authorization field' }
    }

    const { userId } = jwt.verify(req.headers.authorization, $env('JWT_SECRET_KEY'))

    const user = await models.User.scope('withoutPassword').findOne({
      where: {
        id: userId
      }
    })

    if (!user) {
      throw { message: 'User not found' }
    }

    req.me = user

    next()
  } catch (err) {
    const status = 401

    return res.status(status).json({
      status,
      message: err.message
    })
  }
}
