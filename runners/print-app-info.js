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
  const hostForUrl = getHostForUrl(config)

  const url = `http://${hostForUrl}:${config.server.port}`

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
  console.log('|   Mode: ' + (config.server.multiprocessing ? 'multiprocessing' : 'singleProcess'))

  if (config.server.multiprocessing) {
    console.log('|   Number of workers: ' + config.server.multiprocessingWorkers)
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

/**
 * GET-HOST-FOR-URL
 * @param config {Object}
 * @return {string}
 */
function getHostForUrl(config) {
  if (config.server.host === '0.0.0.0') {
    const nets = networkInterfaces()

    const netNames = ['Ethernet', 'eth0']

    for (const name of netNames) {
      if (nets[name]) {
        return nets[name].find((net) => net.family === 'IPv4').address
      }
    }
  }

  return 'localhost'
}
