const execa = require('execa')

const register = require('../register')

/**
 * RUN CRON
 * @param config {Object}
 * @returns {void}
 */
module.exports = (config) => {
  if (config.cron.childProcess) {
    execa(`node ${__dirname}/../child-processes/cron.js`, {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      shell: true
    })
  } else {
    register.cron(config.cron.jobs)
  }
}
