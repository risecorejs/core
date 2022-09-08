const apiDocs = require('@risecorejs/api-docs')

import { env } from '@risecorejs/helpers'
import express from 'express'
import path from 'path'
import fs from 'fs'
import router from '@risecorejs/router'
import { IRoute } from '@risecorejs/router/interfaces'
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
async function getRoutes(configRouter: IConfigRouter) {
  const routes: IRoute[] = []

  if (configRouter.routesDir) {
    configRouter.type = 'local'

    fillingRoutes(configRouter, routes, configRouter.routesDir)
  } else if (configRouter.routesUrl) {
    configRouter.type = 'remote'

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
 * FILLING-ROUTES
 * @param configRouter {Object}
 * @param routes {Array}
 * @param routesDir {string}
 */
function fillingRoutes(configRouter: IConfigRouter, routes: IRoute[], routesDir: string) {
  routesDir = routesDir === '/' ? '' : routesDir

  const baseDir = path.join(path.resolve(), 'routes')

  const files = fs.readdirSync(path.join(baseDir, routesDir))

  for (const file of files) {
    if (!file.startsWith('_')) {
      const filePath = path.join(routesDir, file)
      const fileStat = fs.statSync(baseDir + filePath)

      if (fileStat.isDirectory()) {
        fillingRoutes(configRouter, routes, filePath)
      } else if (file.endsWith('.js')) {
        const route = require(baseDir + filePath)

        fillingRoute(configRouter, route)

        routes.push(route)
      }
    }
  }
}

/**
 * GET-ROUTES-THROUGH-AXIOS
 * @param configRouter {Object}
 * @returns {Promise<Array>}
 */
async function getRoutesThroughAxios(configRouter: IConfigRouter) {
  try {
    const {
      data: { routes }
    } = await axios.get(configRouter.routesUrl)

    return routes
  } catch (err) {
    console.error(err)

    configRouter.status = 'reconnecting'

    return await new Promise((resolve) => {
      setTimeout(async () => {
        const routes = await getRoutesThroughAxios(configRouter)

        resolve(routes)
      }, configRouter.timeout || 3000)
    })
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
