// const makeMigrations = require('@risecorejs/make-migrations')

module.exports = {
  command: 'make:migrations',
  describe: 'Automatic creation of migrations',
  async handler() {
    await makeMigrations()
  }
}
