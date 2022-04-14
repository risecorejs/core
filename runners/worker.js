const express = require('express')
const env = require('@risecorejs/helpers/lib/env')

const packageJson = require('../package.json')
const register = require('../register')
const printAppInfo = require('./print-app-info')
const config = require('../config')

/**
 * RUN WORKER
 * @param config {Object}
 * @returns {void}
 */
module.exports = async (config) => {
  const app = express()

  app.disable('x-powered-by')

  app.get('/', (req, res) => res.send(`${packageJson.description} v${packageJson.version}`))

  if (config.structs && config.structs?.enableAPI !== false) {
    register.structsAPI(config)
  }

  // REGISTER MIDDLEWARE
  register.middleware(config, app)

  // REGISTER ROUTER
  if (Array.isArray(config.router)) {
    if (env('NODE_ENV') !== 'production') {
      app.get('/__routers', (req, res) => res.json({ routers: config.router }))
      app.get('/__docs', (req, res) => res.sendFile(__dirname + '/view/docs.html'))
    }

    for (const routerConfig of config.router) {
      await register.router(routerConfig, app)
    }
  } else {
    await register.router(config.router, app)
  }

  // RUN SERVER
  const server = app.listen(config.server.port, config.server.host, async () => {
    if (!config.server.multiProcessing) {
      printAppInfo(config)
    }

    // RUN START-FUNCTION
    await config.start({ config, app, server })
  })
}
