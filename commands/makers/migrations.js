module.exports = {
  command: 'make:migrations',
  describe: 'Automatic creation of migrations',
  async handler() {
    const makeMigrations = require('@risecorejs/make-migrations')

    await makeMigrations()
  }
}
