import env from '@risecorejs/helpers/lib/env'
import { networkInterfaces } from 'os'
import cronstrue from 'cronstrue'

import packageJSON from '../package.json'

import { IConfigCore } from '../interfaces/config'

export default function (config: IConfigCore) {
  const host = getHost(config)

  const url = `http://${host}:${config.server.port}`

  console.log(`|------------------------------------------------------|`)
  console.log(`| ${packageJSON.description} v${packageJSON.version}`)
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
 * GET-HOST
 * @param config {IConfigCore}
 * @return {string}
 */
function getHost(config: IConfigCore): string {
  if (config.server.host === '0.0.0.0') {
    const nets = networkInterfaces()

    const netNames = ['Ethernet', 'eth0']

    for (const name of netNames) {
      const net = nets[name]

      if (net) {
        const netInfo = net.find((net) => net.family === 'IPv4')

        if (netInfo) {
          return netInfo.address
        }
      }
    }
  }

  return 'localhost'
}
