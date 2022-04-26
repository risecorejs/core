const path = require('path')
const fs = require('fs')
const router = require('@risecorejs/router')
const apiDocs = require('@risecorejs/api-docs')
const axios = require('axios').default

module.exports = async (routerConfig, app) => {
  const routes = await getRoutes(routerConfig)

  app.use(
    routerConfig.baseUrl,
    router(routes, {
      controllers: path.resolve('controllers'),
      middleware: path.resolve('middleware')
    })
  )

  if (routerConfig.apiDocs && process.env.NODE_ENV === 'development') {
    app.use('/__routes' + routerConfig.baseUrl, (req, res) => res.json({ routes }))

    routerConfig.apiDocs.baseUrl = routerConfig.baseUrl === '/' ? '' : routerConfig.baseUrl

    app.use('/__docs' + routerConfig.baseUrl, apiDocs(routes, routerConfig.apiDocs))
  }
}

/**
 * GET-ROUTES
 * @param routerConfig {Object}
 * @returns {Promise<Array>}
 */
async function getRoutes(routerConfig) {
  const routes = []

  if (routerConfig.routesPath) {
    fillingRoutes(routerConfig, routes, path.resolve(), routerConfig.routesPath)
  } else if (routerConfig.routesUrl) {
    try {
      const response = await axios.get(routerConfig.routesUrl)

      for (const route of response.data.routes) {
        fillingRoute(routerConfig, route)

        routes.push(route)
      }
    } catch (err) {
      console.error(err)
    }
  } else {
    throw Error('Routes source required')
  }

  if (routerConfig.routes?.length) {
    for (const route of routerConfig.routes) {
      routes.push(route)
    }
  }

  return routes
}

/**
 * FILLING-ROUTES
 * @param routerConfig {Object}
 * @param routes {Array}
 * @param basePath {string}
 * @param folder {string}
 */
function fillingRoutes(routerConfig, routes, basePath, folder) {
  const files = fs.readdirSync(basePath + folder)

  for (const file of files) {
    if (!file.startsWith('_')) {
      const filePath = path.join(folder, file)
      const fileStat = fs.statSync(basePath + filePath)

      if (fileStat.isDirectory()) {
        fillingRoutes(routerConfig, routes, basePath, filePath)
      } else if (file.endsWith('.js')) {
        const route = require(basePath + filePath)

        fillingRoute(routerConfig, route)

        routes.push(route)
      }
    }
  }
}

/**
 * FILLING-ROUTE
 * @param routerConfig {Object}
 * @param route {Object}
 */
function fillingRoute(routerConfig, route) {
  if (routerConfig.middleware) {
    if (route.middleware) {
      if (Array.isArray(route.middleware)) {
        if (Array.isArray(routerConfig.middleware)) {
          for (const middleware of routerConfig.middleware) {
            route.middleware.unshift(middleware)
          }
        } else {
          route.middleware.unshift(routerConfig.middleware)
        }
      }
    } else {
      route.middleware = routerConfig.middleware
    }
  }

  setController(routerConfig, route)
}

/**
 * SET-CONTROLLER
 * @param routerConfig {Object}
 * @param route {Object}
 */
function setController(routerConfig, route) {
  if (routerConfig.controller) {
    if (route.method) {
      route.controller = routerConfig.controller
    }

    if (route.children?.length) {
      for (const _route of route.children) {
        setController(routerConfig, _route)
      }
    }
  }
}
