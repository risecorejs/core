const path = require('path')

module.exports = {
  homePage: true,
  'x-powered-by': true,
  global: {
    controller: require('@risecorejs/helpers/lib/controller'),
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
