const path = require('path')

module.exports = {
  global: {
    controller: require('./lib/helpers/controller'),
    env: require('./lib/helpers/env')
  },
  server: {
    multiProcessing: false,
    multiProcessingWorkers: null,
    port: process.env.PORT || 5000
  },
  moduleAlias: {
    '~': path.resolve()
  },
  setGlobalStructs: false,
  middleware: {
    rateLimit: {
      windowMs: 5 * 60 * 1000,
      max: 1000
    },
    cors: {},
    validator: {
      locale: 'en'
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
  master(config) {},
  init(config) {},
  start({ config, app, server }) {}
}
