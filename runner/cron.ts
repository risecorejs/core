import execa from 'execa'
import { CronJob } from 'cron'

import { IConfigCron, IConfigCronJobs } from '../interfaces/config'

export default function (configCron: IConfigCron) {
  if (configCron.childProcess) {
    execa(`node ${__dirname}/../child-processes/cron.js`, {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      shell: true
    })
  } else {
    cronRunner(configCron.jobs)
  }
}

/**
 * CRON-RUNNER
 * @param cronJobs {IConfigCronJobs}
 */
export function cronRunner(cronJobs: IConfigCronJobs) {
  for (const [pattern, handler] of Object.entries(cronJobs)) {
    new CronJob(pattern, () => {
      try {
        handler()
      } catch (err) {
        console.error(err)
      }
    }).start()
  }
}
