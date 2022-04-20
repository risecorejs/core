const execa = require('execa')
const rimraf = require('rimraf')
const path = require('path')

module.exports = async (argv) => {
  const folderName = argv[1]

  await execa(`git clone https://github.com/risecorejs/template.git ${folderName || '.'}`, {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    shell: true
  })

  rimraf(path.resolve(...(folderName ? [folderName, '.git'] : ['.git'])), (err) => {
    if (err) {
      console.error(err)
    }
  })

  process.exit(0)
}
