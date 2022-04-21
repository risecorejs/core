const cluster = require('cluster')

/**
 * RUN MASTER
 * @param config {Object}
 * @returns {void}
 */
module.exports = async (config) => {
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
