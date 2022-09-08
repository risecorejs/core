const apiDocs = require('@risecorejs/api-docs')

import { env } from '@risecorejs/helpers'
import express from 'express'
import path from 'path'
import fs from 'fs'
import router from '@risecorejs/router'
import axios from 'axios'

import { IConfigRouter } from '../interfaces/config'

export default function (configRouter: IConfigRouter | IConfigRouter[], app: express.Application) {
  if (Array.isArray(configRouter)) {
    if (env('NODE_ENV') === 'development') {
      app.get('/__routers', (req, res) => {
        return res.json({ routers: configRouter })
      })

      app.get('/__docs', (req, res) => {
        return res.sendFile('docs.html', { root: __dirname + '/../view' })
      })
    }

    for (const item of configRouter) {
      routerRegistration(item, app).catch((err: any) => console.error(err))
    }
  } else {
    routerRegistration(configRouter, app).catch((err: any) => console.error(err))
  }
}

/**
 * ROUTER-REGISTRATION
 * @param configRouter {IConfigRouter}
 * @param app {express.Application}
 */
async function routerRegistration(configRouter: IConfigRouter, app: express.Application) {
  configRouter.type = 'pending'
  configRouter.status = 'pending'

  const routes = await getRoutes(configRouter)

  configRouter.status = 'connected'

  app.use(
    <string>configRouter.baseUrl,
    router(routes, {
      controllersDir: path.resolve('controllers'),
      middlewareDir: path.resolve('middleware')
    })
  )

  if (configRouter.apiDocs && env('NODE_ENV') === 'development') {
    app.use('/__routes' + configRouter.baseUrl, (req, res) => {
      return res.json({ routes })
    })

    configRouter.apiDocs.baseUrl = configRouter.baseUrl === '/' ? '' : configRouter.baseUrl

    app.use('/__docs' + configRouter.baseUrl, apiDocs(routes, configRouter.apiDocs))
  }
}

/**
 * GET-ROUTES
 * @param configRouter {Object}
 * @returns {Promise<Array>}
 */
async function getRoutes(configRouter) {
  const routes = []

  if (configRouter.routesPath) {
    configRouter.type = 'Local'

    fillingRoutes(configRouter, routes, path.resolve(), configRouter.routesPath)
  } else if (configRouter.routesUrl) {
    configRouter.type = 'Remote'

    for (const route of await getRoutesThroughAxios(configRouter)) {
      fillingRoute(configRouter, route)

      routes.push(route)
    }
  } else {
    throw Error('Routes source required')
  }

  if (configRouter.routes?.length) {
    for (const route of configRouter.routes) {
      routes.push(route)
    }
  }

  return routes
}

/**
 * GET-ROUTES-THROUGH-AXIOS
 * @param configRouter {Object}
 * @returns {Promise<Array>}
 */
async function getRoutesThroughAxios(configRouter) {
  try {
    const {
      data: { routes }
    } = await axios.get(configRouter.routesUrl)

    return routes
  } catch (err) {
    console.error(err)

    configRouter.status = 'Reconnecting'

    return await new Promise((resolve) => {
      setTimeout(async () => {
        const routes = await getRoutesThroughAxios(configRouter)

        resolve(routes)
      }, configRouter.timeout || 3000)
    })
  }
}

/**
 * FILLING-ROUTES
 * @param configRouter {Object}
 * @param routes {Array}
 * @param basePath {string}
 * @param folder {string}
 */
function fillingRoutes(configRouter, routes, basePath, folder) {
  const files = fs.readdirSync(basePath + folder)

  for (const file of files) {
    if (!file.startsWith('_')) {
      const filePath = path.join(folder, file)
      const fileStat = fs.statSync(basePath + filePath)

      if (fileStat.isDirectory()) {
        fillingRoutes(configRouter, routes, basePath, filePath)
      } else if (file.endsWith('.js')) {
        const route = require(basePath + filePath)

        fillingRoute(configRouter, route)

        routes.push(route)
      }
    }
  }
}

/**
 * FILLING-ROUTE
 * @param configRouter {Object}
 * @param route {Object}
 */
function fillingRoute(configRouter, route) {
  if (configRouter.middleware) {
    if (route.middleware) {
      if (Array.isArray(route.middleware)) {
        if (Array.isArray(configRouter.middleware)) {
          for (const middleware of configRouter.middleware) {
            route.middleware.unshift(middleware)
          }
        } else {
          route.middleware.unshift(configRouter.middleware)
        }
      }
    } else {
      route.middleware = configRouter.middleware
    }
  }

  setController(configRouter, route)
}

/**
 * SET-CONTROLLER
 * @param configRouter {Object}
 * @param route {Object}
 */
function setController(configRouter, route) {
  if (configRouter.controller) {
    if (route.method) {
      route.controller = configRouter.controller
    }

    if (route.children?.length) {
      for (const _route of route.children) {
        setController(configRouter, _route)
      }
    }
  }
}
