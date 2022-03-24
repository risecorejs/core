const getModels = require('@risecorejs/helpers/lib/get-models')

module.exports = getModels({
  configPath: ['database', 'config'],
  modelDir: ['database', 'models'],
  NODE_ENV: true
})
