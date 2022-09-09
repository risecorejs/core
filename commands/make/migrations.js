const path = require('path')
const makeMigrations = require('@risecorejs/make-migrations')

module.exports = {
  command: 'make:migrations',
  describe: 'Automatic creation of migrations',
  async handler() {
    const outputPath = path.resolve('database', 'migrations')
    const models = require('../../models')

    await makeMigrations(outputPath, models)
  }
}
