const express = require('express')
const env = require('@risecorejs/helpers/lib/env')

const packageJSON = require('../package.json')
const register = require('../registrar')

/**
 * RUN WORKER
 * @param config {Object}
 * @returns {void}
 */
module.exports = async (config) => {
  const app = express()

  app.disable('x-powered-by')

  app.get('/', (req, res) => res.send(`${packageJSON.description} v${packageJSON.version}`))

  if (config.structs && config.structs?.enableAPI !== false) {
    register.structsAPI(config)
  }

  // REGISTER MIDDLEWARE
  register.middleware(config, app)

  // REGISTER ROUTER
  if (Array.isArray(config.router)) {
    if (env('NODE_ENV') === 'development') {
      app.get('/__routers', (req, res) => res.json({ routers: config.router }))
      app.get('/__docs', (req, res) => res.sendFile('docs.html', { root: __dirname + '/../view' }))
    }

    for (const routerConfig of config.router) {
      register.router(routerConfig, app).catch((err) => console.error(err))
    }
  } else {
    register.router(config.router, app).catch((err) => console.error(err))
  }

  // RUN SERVER
  const server = app.listen(config.server.port, config.server.host, async () => {
    // RUN START-FUNCTION
    await config.start({ config, app, server })
  })
}
