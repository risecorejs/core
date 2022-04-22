const execa = require('execa')
const rimraf = require('rimraf')
const path = require('path')

module.exports = {
  command: 'init [folder]',
  describe: 'Init Risecorejs template',
  builder(yargs) {
    yargs.positional('folder', {
      describe: 'Folder name',
      type: 'string'
    })

    yargs.option('folder', { alias: 'f' })

    yargs.example([['$0 init my-project'], ['$0 init --folder my-project'], ['$0 init -f my-project'], ['$0 init .']])

    return yargs
  },
  async handler({ folder }) {
    await execa(`git clone https://github.com/risecorejs/template.git ${folder || '.'}`, {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      shell: true
    })

    rimraf(path.resolve(...(folder ? [folder, '.git'] : ['.git'])), (err) => {
      if (err) {
        console.error(err)
      }
    })
  }
}
