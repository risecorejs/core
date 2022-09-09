import express from 'express'
import { IRoute } from '@risecorejs/router/interfaces'

import { IConfigCore } from '../interfaces/config'
import { IFields } from '../interfaces'

export default function (config: IConfigCore) {
  const route = getRoute()

  if (Array.isArray(config.router)) {
    for (const item of config.router) {
      if (item.main) {
        if (item.routes) {
          item.routes.push(route)
        } else {
          item.routes = [route]
        }

        break
      }
    }
  } else {
    if (config.router.routes) {
      config.router.routes.push(route)
    } else {
      config.router.routes = [route]
    }
  }
}

/**
 * GET-ROUTE
 * @return {IRoute}
 */
function getRoute(): IRoute {
  return {
    group: 'Structs',
    url: '/__structs',
    children: [
      {
        method: 'GET',
        url: '/',
        controller: indexController,
        docs: getDocs()
      }
    ]
  }
}

/**
 * INDEX-CONTROLLER
 * @param req {express.Request}
 * @param res {express.Response}
 */
function indexController(req: express.Request, res: express.Response) {
  try {
    if (req.query.keys?.length) {
      const structs: IFields = {}

      for (const key of <string[]>req.query.keys) {
        if ($structs[key]) {
          structs[key] = $structs[key]
        }
      }

      return res.json({ structs })
    } else {
      return res.json({ structs: $structs })
    }
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}

/**
 * GET-DOCS
 */
function getDocs() {
  return {
    description: 'Show all structs or show structs by keys: ' + Object.keys($structs).join(', '),
    params: {
      'keys[]': {
        value: 'key1'
      },
      keys: {
        value: 'key2'
      }
    }
  }
}
