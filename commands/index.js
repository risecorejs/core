module.exports = {
  init: require('./init'),
  dev: require('./dev'),
  start: require('./start'),
  makeController: (argv) => require('../makers/make-controller')(argv[1], argv[2]),
  makeModel: (argv) => require('../makers/make-model')(argv[1]),
  makeDocs: (argv) => require('../makers/make-docs')(argv[1], argv[2]),
  makeRoutes: (argv) => require('../makers/make-routes')(argv[1], argv[2]),
  makeEntity: require('./make-entity'),
  makeMigrations: () => require('@risecorejs/make-migrations')
}
