import cluster from 'cluster'

import { IConfigCore } from '../interfaces'

export default async function (config: IConfigCore) {
  for (let i = 0; i < config.server.multiprocessingWorkers; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker PID: ${worker.process.pid} died`)

    cluster.fork()
  })

  // RUN-HOOK::MASTER
  if (config.master) {
    await config.master(config)
  }
}
