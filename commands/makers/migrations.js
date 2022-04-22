module.exports = {
  command: 'make:migrations',
  describe: 'Automatic creation of migrations',
  handler() {
    require('@risecorejs/make-migrations')
  }
}
