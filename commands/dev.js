const execa = require('execa')

module.exports = (argv) => {
  execa(`nodemon ${__dirname}/../start.js`, {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    shell: true
  })
}
