require('dotenv').config()

import { setGlobalStructs, env } from '@risecorejs/helpers'
import os from 'os'
import cluster from 'cluster'
import processesRunner from '@risecorejs/processes-runner'

import register from './register'
import runners from './runners'

import config from './config'

// REGISTER MODULE-ALIAS
if (config.moduleAlias) {
  register.moduleAlias(config.moduleAlias)
}

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
    config.server.port = env('$CLI_PORT', Number)
  }

  if (env('$CLI_MULTIPROCESSING')) {
    config.server.multiprocessing = true
  }

  if (config.server.multiprocessing) {
    if (env('$CLI_MULTIPROCESSING_WORKERS')) {
      config.server.multiprocessingWorkers = env('$CLI_MULTIPROCESSING_WORKERS', Number)
    }

    config.server.multiprocessingWorkers ||= os.cpus().length - 1
  }

  // RUN INIT-FUNCTION
  await config.init(config)

  if (cluster.isPrimary) {
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
