// SHOW
exports.show = {
  private: true,
  description: 'Show me'
}

// UPDATE
exports.update = {
  private: true,
  description: 'Update me',
  bodyUI: true,
  body: {
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
