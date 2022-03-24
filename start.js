require('dotenv').config()

const merge = require('merge')
const path = require('path')
const cluster = require('cluster')
const os = require('os')
const express = require('express')

const setGlobalStructs = require('@risecorejs/helpers/lib/set-global-structs')
const register = require('./register')
const packageJson = require('./package.json')

// MERGE INITIAL-CONFIG AND APP-CONFIG
const config = merge.recursive(require('./config'), require(path.resolve('config')))

// REGISTER MODULE-ALIAS
register.moduleAlias(config.moduleAlias)

// REGISTER GLOBAL-VARIABLES
register.globalVariables(config.global)

void (async () => {
  // RUN INIT-FUNCTION
  await config.init(config)

  // SET GLOBAL-STRUCTS
  if (config.setGlobalStructs) {
    setGlobalStructs()
  }

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

    app.get('/', (req, res) => res.send(`${packageJson.description} v${packageJson.version}`))

    app.disable('x-powered-by')

    // REGISTER MIDDLEWARE
    await register.middleware(config, app)

    // RUN SERVER
    const server = app.listen(config.server.port, () => {
      console.log('App listening on port: ' + config.server.port)
      console.log('Press Ctrl+C to quit.')
    })

    // RUN START-FUNCTION
    await config.start({ config, app, server })
  }
})()
