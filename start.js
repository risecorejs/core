require('dotenv').config()

const setGlobalStructs = require('@risecorejs/helpers/lib/set-global-structs')
const cluster = require('cluster')

const register = require('./register/index')
const runners = require('./runners/index')
const config = require('./config')

// REGISTER MODULE-ALIAS
register.moduleAlias(config.moduleAlias)

// REGISTER GLOBAL-VARIABLES
register.globalVariables(config.global)

// SET GLOBAL-STRUCTS
if (config.structs && config.structs?.setGlobal !== false) {
  setGlobalStructs(config.structs.dir)
}

void (async () => {
  // RUN INIT-FUNCTION
  await config.init(config)

  if (cluster.isMaster) {
    if (config.server.multiProcessing) {
      await runners.master(config)
    } else {
      await runners.worker(config)
    }

    if (config.cron) {
      runners.cron(config)
    }
  } else {
    await runners.worker(config)
  }
})()
