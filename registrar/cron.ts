import { CronJob } from 'cron'

import { IConfigCron } from '../interfaces/config'

export default function (configCron: IConfigCron) {
  for (const [pattern, handler] of Object.entries(configCron.jobs)) {
    new CronJob(pattern, () => {
      try {
        handler()
      } catch (err) {
        console.error(err)
      }
    }).start()
  }
}
