const env = require('@risecorejs/helpers/lib/env')
const { networkInterfaces } = require('os')
const cronstrue = require('cronstrue')

const packageJson = require('../package.json')

/**
 * RUN PRINT-APP-INFO
 * @param config {Object}
 * @returns {void}
 */
module.exports = (config) => {
  if (config.server.host === '0.0.0.0') {
    const nets = networkInterfaces()

    const netNames = ['Ethernet', 'eth0']

    for (const name of netNames) {
      if (nets[name]) {
        config.server.host = nets[name].find((net) => net.family === 'IPv4').address

        break
      }
    }
  }

  const url = `http://${config.server.host}:${config.server.port}`

  console.log(`|------------------------------------------------------|`)
  console.log(`| ${packageJson.description} v${packageJson.version}`)
  console.log(`|------------------------------------------------------|`)

  console.log(`| # APP`)
  console.log(`|   URL: ${url}`)

  if (env('NODE_ENV') === 'development') {
    console.log(`|   Docs URL: ${url}/__docs`)
  }

  console.log('|   Press Ctrl+C to quit.')
  console.log(`|------------------------------------------------------|`)

  console.log(`| # SERVER`)
  console.log('|   Host: ' + config.server.host)
  console.log('|   Port: ' + config.server.port)
  console.log('|   Mode: ' + (config.server.multiProcessing ? 'multiProcessing' : 'singleProcess'))

  if (config.server.multiProcessing) {
    console.log('|   Number of workers: ' + config.server.multiProcessingWorkers)
  }

  if (config.cron) {
    console.log(`|------------------------------------------------------|`)
    console.log(`| # CRON`)
    console.log('|   Mode: ' + (config.cron.childProcess ? 'childProcess' : 'inside'))
    console.log('|   Number of jobs: ' + Object.keys(config.cron.jobs).length)

    for (const [pattern] of Object.entries(config.cron.jobs)) {
      console.log(
        `|   - ${pattern} (${cronstrue.toString(pattern, {
          verbose: true,
          use24HourTimeFormat: true
        })})`
      )
    }
  }

  if (config.processes) {
    console.log(`|------------------------------------------------------|`)
    console.log(`| # PROCESSES`)
    console.log('|   Number of processes: ' + Object.keys(config.processes).length)

    for (const [processName] of Object.entries(config.processes)) {
      console.log(`|   - ${processName}`)
    }
  }

  console.log(`|------------------------------------------------------|\n`)
}
