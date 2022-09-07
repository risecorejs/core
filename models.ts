const { getModels } = require('@risecorejs/helpers')

export default getModels({
  configPath: ['database', 'config'],
  modelsDir: ['database', 'models'],
  NODE_ENV: true
})
