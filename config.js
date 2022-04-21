const path = require('path')
const merge = require('merge')
const env = require('@risecorejs/helpers/lib/env')
const crudBuilder = require('@risecorejs/crud-builder')

const models = require('./models')

const initialConfig = {
  global: {
    controller: (filename) => (method) => filename + '.' + method,
    env,
    crudBuilder
  },
  server: {
    host: env('HOST', 'localhost'),
    port: env('PORT', 8000),
    multiprocessing: false,
    multiprocessingWorkers: null
  },
  moduleAlias: {
    '~': path.resolve()
  },
  storage: true,
  structs: {
    setGlobal: true,
    enableAPI: true,
    dir: path.resolve('structs')
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

const appConfig = require(path.resolve('config'))

// MERGE INITIAL-CONFIG AND APP-CONFIG
const { config } = merge.recursive({ config: initialConfig }, { config: appConfig })

module.exports = config
