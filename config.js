const path = require('path')
const models = require('./models')

module.exports = {
  global: {
    controller: (filename) => (method) => filename + '.' + method,
    env: require('@risecorejs/helpers/lib/env'),
    crudBuilder: require('@risecorejs/crud-builder')
  },
  server: {
    multiProcessing: false,
    multiProcessingWorkers: null,
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000
  },
  moduleAlias: {
    '~': path.resolve()
  },
  storage: false,
  structs: {
    setGlobal: true,
    enableAPI: true
  },
  middleware: {
    rateLimit: {
      windowMs: 5 * 60 * 1000,
      max: 1000
    },
    cors: {},
    validator: {
      locale: 'en',
      sequelize: models.sequelize
    },
    router: {
      baseUrl: '/',
      routesPath: '/routes',
      apiDocs: {
        title: 'API-docs'
      }
    },
    extend: () => []
  },
  init(config) {},
  master(config) {},
  start({ config, app, server }) {}
}
