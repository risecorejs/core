const models = require('@risecorejs/core/models')

const endpoints = $crudBuilder({
  model: 'User',
  endpoints: {
    show,
    update
  }
})

module.exports = endpoints

// SHOW
function show() {
  return {
    model: models.User.scope('withoutPassword'),
    key: false,
    queryBuilder(req) {
      return {
        where: {
          id: req.me.id
        }
      }
    },
    response(user) {
      return { user }
    }
  }
}

// UPDATE
function update() {
  return {
    key: false,
    queryBuilder(req) {
      return {
        where: {
          id: req.me.id
        }
      }
    },
    rules({ instance: user }) {
      return {
        email: `ifExists|if:email!=="${user.email}"|required|email|max:200|unique:user`,
        password: 'ifExists|required|string|between:8-200',
        passwordConfirm: 'ifExists:password|required|as:password'
      }
    },
    fields: ['email', 'password'],
    response({ instance }) {
      const user = instance.toJSON()

      delete user.password

      return { user }
    }
  }
}
