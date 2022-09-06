import execa from 'execa'

import register from '../register'

import { IConfigCron } from '../interfaces'

/**
 * RUN CRON
 * @param configCron {Object}
 * @returns {void}
 */
export default function (configCron: IConfigCron): void {
  if (configCron.childProcess) {
    execa(`node ${__dirname}/../child-processes/cron.js`, {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      shell: true
    }).catch((err) => console.error(err))
  } else {
    register.cron(configCron.jobs)
  }
}
