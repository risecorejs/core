const docs = require('../docs/me')

const endpoint = $controller('me')

module.exports = {
  group: 'Me',
  url: '/me',
  middleware: 'auth',
  children: [
    // SHOW
    {
      method: 'GET',
      url: '/',
      controller: endpoint('show'),
      docs: docs.show
    },
    // UPDATE
    {
      method: 'PUT',
      url: '/',
      controller: endpoint('update'),
      docs: docs.update
    }
  ]
}
