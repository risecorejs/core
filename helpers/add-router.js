const path = require('path')
const fs = require('fs')
const router = require('@risecorejs/router')
const apiDocs = require('@risecorejs/api-docs')
const axios = require('axios').default

module.exports = async (config, middleware) => {
  const routes = []

  if (config.routesPath) {
    fillingRoutes(config, routes, path.resolve(), config.routesPath)
  } else if (config.routesUrl) {
    const response = await axios.get(config.routesUrl)

    for (const route of response.data.routes) {
      fillingRoute(config, route)
    }

    routes.push(...response.data.routes)
  } else {
    throw Error('Routes source required')
  }

  middleware.push([
    config.baseUrl,
    router(routes, {
      middleware: '~/middleware',
      controllers: '~/controllers'
    })
  ])

  middleware.push(['/__routes' + config.baseUrl, (req, res) => () => res.json({ routes })])

  if (config.apiDocs && process.env.NODE_ENV !== 'production') {
    config.apiDocs.baseUrl = config.baseUrl === '/' ? '' : config.baseUrl

    middleware.push(['/__docs' + config.baseUrl, apiDocs(routes, config.apiDocs)])
  }
}

/**
 * FILLING-ROUTES
 * @param config {Object}
 * @param routes {Array}
 * @param basePath {string}
 * @param folder {string}
 */
function fillingRoutes(config, routes, basePath, folder) {
  const files = fs.readdirSync(basePath + folder)

  for (const file of files) {
    if (file.startsWith('_')) continue

    const filePath = path.join(folder, file)
    const fileStat = fs.statSync(basePath + filePath)

    if (fileStat.isDirectory()) {
      fillingRoutes(config, routes, basePath, filePath)
    } else {
      const route = require(basePath + filePath)

      fillingRoute(config, route)

      routes.push(route)
    }
  }
}

/**
 * FILLING-ROUTE
 * @param config {Object}
 * @param route {Object}
 */
function fillingRoute(config, route) {
  if (config.middleware) {
    if (route.middleware) {
      if (Array.isArray(route.middleware)) {
        route.middleware.unshift(...(Array.isArray(config.middleware) ? config.middleware : [config.middleware]))
      }
    } else {
      route.middleware = config.middleware
    }
  }

  if (config.controller) {
    route.controller = config.controller
  }
}
