const makeMigrations = require('@risecorejs/make-migrations')
const path = require('path')

module.exports = {
  command: 'make:migrations',
  describe: 'Automatic creation of migrations',
  async handler() {
    const outputPath = path.resolve('database', 'migrations')
    const models = require('../../models')

    await makeMigrations(outputPath, models)
  }
}
