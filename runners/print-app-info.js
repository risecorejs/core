const env = require('@risecorejs/helpers/lib/env')

const packageJson = require('../package.json')

/**
 * RUN PRINT-APP-INFO
 * @param config {Object}
 * @param numberOfWorkers {number?}
 * @returns {void}
 */
module.exports = (config, numberOfWorkers) => {
  const url = `http://${config.server.host}:${config.server.port}`

  console.log(`|------------------------------------------------------|`)
  console.log(`| ${packageJson.description} v${packageJson.version}`)
  console.log(`|------------------------------------------------------|`)

  console.log(`| # SERVER`)
  console.log('| Host: ' + config.server.host)
  console.log('| Port: ' + config.server.port)
  console.log('| Mode: ' + (config.server.multiProcessing ? 'multiProcessing' : 'singleProcess'))

  if (config.server.multiProcessing) {
    console.log('| Number of workers: ' + numberOfWorkers)
  }

  console.log(`|------------------------------------------------------|`)

  if (config.cron) {
    console.log(`| # CRON`)
    console.log('| Mode: ' + (config.cron.childProcess ? 'childProcess' : 'inside'))
    console.log('| Number of jobs: ' + Object.keys(config.cron.jobs).length)
    console.log(`|------------------------------------------------------|`)
  }

  console.log(`| # APP`)
  console.log(`| URL: ${url}`)

  if (env('NODE_ENV') !== 'production') {
    console.log(`| Docs URL: ${url}/__docs`)
  }

  console.log('| Press Ctrl+C to quit.')
  console.log(`|------------------------------------------------------|\n`)
}