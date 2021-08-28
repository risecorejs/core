require('dotenv').config()

const merge = require('merge')
const path = require('path')
const cluster = require('cluster')
const os = require('os')
const express = require('express')

const register = require(__dirname + '/register')

// MERGE INITIAL-CONFIG AND APP-CONFIG
const config = merge.recursive(
  require(__dirname + '/config'),
  require(path.resolve('config'))
)

// REGISTER MODULE-ALIAS
register.moduleAlias(config.moduleAlias)

// REGISTER GLOBAL-VARIABLES
register.globalVariables(config.global)

// RUN INIT-FUNCTION
config.init(config)

if (config.server.multiProcessing && cluster.isMaster) {
  // RUN MASTER-FUNCTION
  config.master(config)

  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)

    cluster.fork()
  })
} else {
  const app = express()

  // REGISTER MIDDLEWARE
  register.middleware(config, app)

  // RUN SERVER
  const server = app.listen(config.server.port, () => {
    console.log('App listening on port: ' + config.server.port)
    console.log('Press Ctrl+C to quit.')
  })

  // RUN START-FUNCTION
  config.start({ config, app, server })
}
