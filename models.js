const models = require('./lib/helpers/models')

module.exports = models({
  configPath: ['database', 'config'],
  modelDir: ['database', 'models']
})
