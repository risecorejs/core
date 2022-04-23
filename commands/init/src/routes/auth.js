const docs = require('../docs/auth')

const endpoint = $controller('auth')

module.exports = {
  group: 'Auth',
  url: '/auth',
  children: [
    // SIGN-UP
    {
      method: 'POST',
      url: '/sign-up',
      controller: endpoint('signUp'),
      docs: docs.signUp
    },
    // SIGN-IN
    {
      method: 'POST',
      url: '/sign-in',
      controller: endpoint('signIn'),
      docs: docs.signIn
    }
  ]
}
