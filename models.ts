const getModels = require('@risecorejs/helpers/lib/get-models')

export default getModels({
  configPath: ['database', 'config'],
  modelDir: ['database', 'models'],
  NODE_ENV: true
})
