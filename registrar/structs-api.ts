import express from 'express'
import { IRoute } from '@risecorejs/router/interfaces'

import { IConfigCore } from '../interfaces/config'

export default function (config: IConfigCore) {
  const route = getRoute()

  if (Array.isArray(config.router)) {
    for (const routerConfig of config.router) {
      if (routerConfig.main) {
        if (routerConfig.routes) {
          routerConfig.routes.push(route)
        } else {
          routerConfig.routes = [route]
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

// GET-ROUTE
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

// INDEX-CONTROLLER
function indexController(req: express.Request & {}, res: express.Response) {
  try {
    if (req.query.codes?.length) {
      const structs: { [key: string]: any } = {}

      for (const code of <string[]>req.query.codes) {
        if ($structs[code]) {
          structs[code] = $structs[code]
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

// GET-DOCS
function getDocs() {
  return {
    description: 'Show all structs or show structs by codes: ' + Object.keys($structs).join(', '),
    params: {
      'codes[]': {
        value: 'code1'
      },
      codes: {
        value: 'code2'
      }
    }
  }
}
