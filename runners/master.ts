import cluster from 'cluster'

import { IConfigDefault } from '../interfaces/index'

/**
 * RUN MASTER
 * @param config {Object}
 * @returns {void}
 */
export default async function (config: IConfigDefault): Promise<void> {
  for (let i = 0; i < config.server.multiprocessingWorkers; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker PID: ${worker.process.pid} died`)

    cluster.fork()
  })

  // RUN MASTER-FUNCTION
  await config.master(config)
}
