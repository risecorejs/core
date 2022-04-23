const orderByUsers = require('../database/order-by/users')

// CREATE
exports.create = {
  private: true,
  description: 'Create user',
  bodyUI: true,
  body: {
    email: {
      type: 'string',
      required: 'ifExists',
      value: 'newuser@example.com',
      description: 'Email must be unique'
    },
    password: {
      type: 'string',
      required: 'ifExists',
      value: 'some-password',
      description: 'Minimum number of characters 8'
    },
    passwordConfirm: {
      type: 'string',
      required: 'ifExists:password',
      value: 'some-password',
      description: 'This field must be the same as "password"'
    }
  }
}

// INDEX
exports.index = {
  private: true,
  description: 'Show users with pagination',
  params: {
    page: {
      value: 1
    },
    pageSize: {
      value: 25
    },
    id: {
      value: 3
    },
    email: {
      value: 'user@'
    },
    'order[]': {
      value: Object.keys(orderByUsers()).join(' | ')
    },
    order: {
      value: 'ASC | DESC'
    }
  }
}

// SHOW
exports.show = {
  private: true,
  description: 'Show user by ID'
}

// UPDATE
exports.update = {
  private: true,
  description: 'Update user by ID',
  bodyUI: true,
  body: {
    role: {
      type: 'string',
      required: 'ifExists',
      value: 'admin',
      variants: $structs.users.roles
    },
    email: {
      type: 'string',
      required: 'ifExists',
      value: 'admin@example.com',
      description: 'Email must be unique'
    },
    password: {
      type: 'string',
      required: 'ifExists',
      value: 'new-password',
      description: 'Minimum number of characters 8'
    },
    passwordConfirm: {
      type: 'string',
      required: 'ifExists:password',
      value: 'new-password',
      description: 'This field must be the same as "password"'
    }
  }
}

// DESTROY
exports.destroy = {
  private: true,
  description: 'Destroy user by ID'
}
