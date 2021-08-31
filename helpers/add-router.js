const path = require('path')
const fs = require('fs')
const router = require('@risecorejs/router')
const apiDocs = require('@risecorejs/api-docs')

module.exports = (config, middleware) => {
  const routes = []
  const basePath = path.resolve()

  function fillingRoutes(folder) {
    const files = fs.readdirSync(basePath + folder)

    for (const file of files) {
      if (file.startsWith('_')) continue

      const filePath = path.join(folder, file)
      const fileStat = fs.statSync(basePath + filePath)

      fileStat.isDirectory()
        ? fillingRoutes(filePath)
        : routes.push(require(basePath + filePath))
    }
  }

  fillingRoutes(config.routesPath)

  middleware.push([
    config.baseUrl,
    router(routes, { middleware: '@middleware', controllers: '@controllers' })
  ])

  if (process.env.NODE_ENV !== 'production' && !!config.apiDocs) {
    config.apiDocs.baseUrl = config.baseUrl === '/' ? '' : config.baseUrl

    middleware.push(['/docs' + config.baseUrl, apiDocs(routes, config.apiDocs)])
  }
}
