require('dotenv').config()

const setGlobalStructs = require('@risecorejs/helpers/lib/set-global-structs')
const env = require('@risecorejs/helpers/lib/env')
const os = require('os')
const cluster = require('cluster')
const processesRunner = require('@risecorejs/processes-runner')

const register = require('./register')
const runners = require('./runners')
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
  if (env('$CLI_HOST')) {
    config.server.host = env('$CLI_HOST')
  }

  if (env('$CLI_PORT')) {
    config.server.port = env('$CLI_PORT', Number())
  }

  if (env('$CLI_MULTIPROCESSING')) {
    config.server.multiprocessing = true
  }

  if (config.server.multiprocessing) {
    if (env('$CLI_MULTIPROCESSING_WORKERS')) {
      config.server.multiprocessingWorkers = env('$CLI_MULTIPROCESSING_WORKERS', Number())
    }

    config.server.multiprocessingWorkers ||= os.cpus().length - 1
  }

  // RUN INIT-FUNCTION
  await config.init(config)

  if (cluster.isMaster) {
    if (config.server.multiprocessing) {
      await runners.master(config)
    } else {
      await runners.worker(config)
    }

    runners.printAppInfo(config)

    if (config.cron) {
      runners.cron(config)
    }

    if (config.processes) {
      await processesRunner(config.processes)
    }
  } else {
    await runners.worker(config)
  }
})()
