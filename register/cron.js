const { CronJob } = require('cron')

module.exports = (cronJobs) => {
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
