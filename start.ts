require('dotenv').config()

import cluster from 'cluster'

import registrar from './registrar'
import runner from './runner'

import config from './config'

// REGISTER::MODULE-ALIAS
if (config.moduleAliases) {
  registrar.moduleAliases(config.moduleAliases)
}

// REGISTER::GLOBAL-VARIABLES
registrar.globalVariables(config.global)

// REGISTER::GLOBAL-STRUCTS
if (config.structs && config.structs.setGlobal !== false) {
  registrar.globalStructs(config.structs)
}

void (async () => {
  // RUN-HOOK::INIT
  if (config.init) {
    await config.init(config)
  }

  if (cluster.isPrimary) {
    if (config.server.multiprocessing) {
      // RUN::MASTER
      await runner.master(config)
    } else {
      // RUN::WORKER
      await runner.worker(config)
    }

    // RUN::CRON
    runner.cron(config.cron)

    // RUN::PROCESSES
    if (config.processes) {
      runner.processes(config.processes).catch((err: any) => console.error(err))
    }

    // RUN::PRINT-APP-INFO
    runner.printAppInfo(config)
  } else {
    // RUN::WORKER
    await runner.worker(config)
  }
})()
