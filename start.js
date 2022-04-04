require('dotenv').config()

const merge = require('merge')
const path = require('path')
const setGlobalStructs = require('@risecorejs/helpers/lib/set-global-structs')
const cluster = require('cluster')
const os = require('os')
const express = require('express')
const env = require('@risecorejs/helpers/lib/env')

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
    const numberOfWorkers = config.server.multiProcessingWorkers || os.cpus().length - 1

    for (let i = 0; i < numberOfWorkers; i++) {
      cluster.fork()

      if (numberOfWorkers - 1 === i) {
        printAppInfo(numberOfWorkers)
      }
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker PID: ${worker.process.pid} died`)

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
    const server = app.listen(config.server.port, async () => {
      if (!config.server.multiProcessing) {
        printAppInfo()
      }

      // RUN START-FUNCTION
      await config.start({ config, app, server })
    })
  }
})()

/**
 * PRINT-APP-INFO
 * @param numberOfWorkers {number|void}
 */
function printAppInfo(numberOfWorkers) {
  const url = `http://${config.server.host}:${config.server.port}`

  console.log(`|------------------------------------------------------|`)
  console.log(`| ${packageJson.description} v${packageJson.version}`)
  console.log(`|------------------------------------------------------|`)

  if (config.server.multiProcessing) {
    console.log('| Mode: Cluster')
    console.log('| Number of workers: ' + numberOfWorkers)
  }

  console.log('| App listening on port: ' + config.server.port)
  console.log(`| URL: ${url}`)

  if (env('NODE_ENV') !== 'production') {
    console.log(`| Docs URL: ${url}/__docs`)
  }

  console.log('| Press Ctrl+C to quit.')
  console.log(`|------------------------------------------------------|\n`)
}
