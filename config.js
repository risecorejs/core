const path = require('path')
const env = require('@risecorejs/helpers/lib/env')
const crudBuilder = require('@risecorejs/crud-builder')

const models = require('./models')

module.exports = {
  global: {
    controller: (filename) => (method) => filename + '.' + method,
    env,
    crudBuilder
  },
  server: {
    host: env('HOST', 'localhost'),
    port: env('PORT', 5000),
    multiProcessing: false,
    multiProcessingWorkers: null
  },
  moduleAlias: {
    '~': path.resolve()
  },
  storage: true,
  structs: {
    setGlobal: true,
    enableAPI: true
  },
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
  middleware: {
    rateLimit: {
      windowMs: 5 * 60 * 1000,
      max: 1000
    },
    cors: {},
    extend: () => []
  },
  init(config) {},
  master(config) {},
  start({ config, app, server }) {}
}
