import express from 'express'
import { env } from '@risecorejs/helpers'

import registrar from '../registrar'

const packageJSON = require('../package.json')

import { IConfigCore } from '../interfaces/config'

export default async function (config: IConfigCore) {
  const app = express()

  app.disable('x-powered-by')

  app.get('/', (req, res) => res.send(`${packageJSON.description} v${packageJSON.version}`))

  // REGISTER::STRUCTS-API
  if (config.structs && config.structs.enableAPI !== false) {
    registrar.structsAPI(config)
  }

  // REGISTER::MIDDLEWARE
  registrar.middleware(config, app)

  // REGISTER::ROUTER
  if (Array.isArray(config.router)) {
    if (env('NODE_ENV') === 'development') {
      app.get('/__routers', (req, res) => {
        return res.json({ routers: config.router })
      })

      app.get('/__docs', (req, res) => {
        return res.sendFile('docs.html', { root: __dirname + '/../view' })
      })
    }

    for (const item of config.router) {
      registrar.router(item, app).catch((err: any) => console.error(err))
    }
  } else {
    registrar.router(config.router, app).catch((err: any) => console.error(err))
  }

  // RUN::SERVER
  const server = app.listen(<number>config.server.port, <string>config.server.host, async () => {
    // RUN-HOOK::START
    await config.start({ config, app, server })
  })
}
