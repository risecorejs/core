import { cronRunner } from '../runner/cron'

import config from '../config'

if (config.cron) {
  cronRunner(config.cron.jobs)
}
