require('dotenv').config()

import cluster from 'cluster'

import config from './config'

import registrar from './registrar'
import runner from './runner'

// REGISTER::MODULE-ALIASES
if (config.moduleAliases) {
  registrar.moduleAliases(config.moduleAliases)
}

// REGISTER::GLOBAL-VARIABLES
if (config.global) {
  registrar.globalVariables(config.global)
}

// REGISTER::GLOBAL-STRUCTS
if (config.structs && config.structs.setGlobal) {
  registrar.globalStructs(config.structs)
}

void (async () => {
  // RUN-HOOK::INIT
  if (config.init) {
    await config.init(config)
  }

  // IS::MASTER
  if (cluster.isPrimary) {
    // IS::MULTIPROCESSING
    if (config.server.multiprocessing) {
      // RUN::MASTER
      await runner.master(config)
    }

    // IS::SINGLE-PROCESS
    else {
      // RUN::WORKER
      await runner.worker(config)
    }

    // RUN::CRON
    if (config.cron) {
      runner.cron(config.cron)
    }

    // RUN::PROCESSES
    if (config.processes) {
      runner.processes(config.processes).catch((err: any) => console.error(err))
    }

    // RUN::PRINT-APP-INFO
    runner.printAppInfo(config)
  }

  // IS::WORKER
  else {
    // RUN::WORKER
    await runner.worker(config)
  }
})()
