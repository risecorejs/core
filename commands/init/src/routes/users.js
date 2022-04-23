const { pagination, paramsIsNotNaN } = require('@risecorejs/middleware')

const access = require('../middleware/access')
const docs = require('../docs/users')

const endpoint = $controller('users')

module.exports = {
  group: 'Users',
  url: '/users',
  middleware: 'auth',
  children: [
    // CREATE
    {
      method: 'POST',
      url: '/',
      middleware: access(['admin', 'manager']),
      controller: endpoint('create'),
      docs: docs.create
    },
    // INDEX
    {
      method: 'GET',
      url: '/',
      middleware: [access(['admin', 'manager']), pagination],
      controller: endpoint('index'),
      docs: docs.index
    },
    // SHOW
    {
      method: 'GET',
      url: '/:id',
      middleware: [access(['admin', 'manager']), paramsIsNotNaN('id')],
      controller: endpoint('show'),
      docs: docs.show
    },
    // UPDATE
    {
      method: 'PUT',
      url: '/',
      middleware: [access('admin'), paramsIsNotNaN('id')],
      controller: endpoint('update'),
      docs: docs.update
    },
    // DESTROY
    {
      method: 'DELETE',
      url: '/:id',
      middleware: [access('admin'), paramsIsNotNaN('id')],
      controller: endpoint('destroy'),
      docs: docs.destroy
    }
  ]
}
