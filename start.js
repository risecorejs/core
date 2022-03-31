require('dotenv').config()

const merge = require('merge')
const path = require('path')
const setGlobalStructs = require('@risecorejs/helpers/lib/set-global-structs')
const cluster = require('cluster')
const os = require('os')
const express = require('express')

const initialConfig = require('./config')
const appConfig = require(path.resolve('config'))

const register = require('./register/index')
const packageJson = require('./package.json')

// MERGE INITIAL-CONFIG AND APP-CONFIG
const { config } = merge.recursive({ config: initialConfig }, { config: appConfig })

// REGISTER MODULE-ALIAS
register.moduleAlias(config.moduleAlias)

// REGISTER GLOBAL-VARIABLES
register.globalVariables(config.global)

// SET GLOBAL-STRUCTS
if (config.structs && config.structs?.setGlobal !== false) {
  setGlobalStructs()
}

void (async () => {
  // RUN INIT-FUNCTION
  await config.init(config)

  if (config.server.multiProcessing && cluster.isMaster) {
    for (let i = 0; i < (config.server.multiProcessingWorkers || os.cpus().length - 1); i++) {
      cluster.fork()
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`)

      cluster.fork()
    })

    // RUN MASTER-FUNCTION
    await config.master(config)
  } else {
    const app = express()

    app.disable('x-powered-by')

    app.get('/', (req, res) => res.send(`${packageJson.description} v${packageJson.version}`))

    if (config.structs && config.structs?.enableAPI !== false) {
      register.structsAPI(config)
    }

    // REGISTER MIDDLEWARE
    register.middleware(config, app)

    // REGISTER ROUTER
    if (Array.isArray(config.middleware.router)) {
      for (const routerConfig of config.middleware.router) {
        await register.router(routerConfig, app)
      }
    } else {
      await register.router(config.middleware.router, app)
    }

    // RUN SERVER
    const server = app.listen(config.server.port, () => {
      console.log('App listening on port: ' + config.server.port)
      console.log('Press Ctrl+C to quit.')
    })

    // RUN START-FUNCTION
    await config.start({ config, app, server })
  }
})()
