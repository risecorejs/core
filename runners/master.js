const os = require('os')
const cluster = require('cluster')

const runners = require('./index')

/**
 * RUN-MASTER
 * @param config {Object}
 * @returns {void}
 */
module.exports = async (config) => {
  const numberOfWorkers = config.server.multiProcessingWorkers || os.cpus().length - 1

  for (let i = 0; i < numberOfWorkers; i++) {
    cluster.fork()

    if (numberOfWorkers - 1 === i) {
      runners.printAppInfo(config, numberOfWorkers)
    }
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker PID: ${worker.process.pid} died`)

    cluster.fork()
  })

  // RUN MASTER-FUNCTION
  await config.master(config)
}
