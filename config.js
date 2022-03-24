const path = require('path')

module.exports = {
  global: {
    controller: (filename) => (method) => filename + '.' + method,
    env: require('@risecorejs/helpers/lib/env')
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
  init(config) {},
  master(config) {},
  start({ config, app, server }) {}
}
