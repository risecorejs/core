const makers = require('./makers')

module.exports = {
  init: require('./init'),
  dev: require('./dev'),
  start: require('./start'),
  makers: {
    controller: makers.controller,
    model: makers.model,
    docs: makers.docs,
    routes: makers.routes,
    entity: makers.entity,
    migrations: makers.migrations
  }
}
