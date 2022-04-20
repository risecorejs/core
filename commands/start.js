const execa = require('execa')

module.exports = (argv) => {
  execa(`node ${__dirname}/../start.js`, {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    shell: true
  })
}
