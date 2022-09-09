import express from 'express'

import registrar from '../registrar'
import packageJSON from '../package.json'

import { IConfigCore } from '../interfaces/config'

export default async function (config: IConfigCore) {
  const app = express()

  app.disable('x-powered-by')

  app.get('/', (req, res) => res.send(`${packageJSON.description} v${packageJSON.version}`))

  // REGISTER::STRUCTS-API
  if (config.structs && config.structs.enableAPI) {
    registrar.structsAPI(config)
  }

  // REGISTER::MIDDLEWARE
  registrar.middleware(config, app)

  // REGISTER::ROUTERS
  registrar.routers(config.router, app)

  // CREATE::SERVER
  const server = app.listen(config.server.port, config.server.host, async () => {
    // RUN-HOOK::START
    if (config.start) {
      await config.start({ config, app, server })
    }
  })
}
