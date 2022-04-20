const makers = require('../makers/index')

module.exports = {
  init: require('./init'),
  dev: require('./dev'),
  start: require('./start'),
  makers: {
    controller: (argv) => makers.controller(argv[1], argv[2]),
    model: (argv) => makers.model(argv[1]),
    docs: (argv) => makers.docs(argv[1], argv[2]),
    routes: (argv) => makers.routes(argv[2]),
    entity: require('./make-entity'),
    migrations: () => require('@risecorejs/make-migrations')
  }
}
