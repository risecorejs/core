const models = require('@risecorejs/helpers/lib/models')

module.exports = models({
  configPath: ['database', 'config'],
  modelDir: ['database', 'models']
})
