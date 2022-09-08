import execa from 'execa'

import registrar from '../registrar'

import { IConfigCron } from '../interfaces/config'

export default function (configCron: IConfigCron) {
  if (configCron.childProcess) {
    execa(`node ${__dirname}/../child-processes/cron.js`, {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      shell: true
    })
  } else {
    registrar.cron(configCron)
  }
}
