import express from 'express'

import registrar from '../registrar'
import packageJSON from '../package.json'

import { IConfigCore } from '../interfaces'

export default async function (config: IConfigCore) {
  // INIT::APP
  const app = express()

  // APP:DISABLE::X-POWERED-BY
  app.disable('x-powered-by')

  // APP:ADD-PAGE::HOME
  app.get('/', (req, res) => res.send(`${packageJSON.description} v${packageJSON.version}`))

  // REGISTER::CORE-GLOBAL-VARIABLES
  registrar.coreGlobalVariables()

  // REGISTER::STRUCTS-API
  if (config.structs && config.structs.enableAPI) {
    registrar.structsAPI(config)
  }

  // REGISTER::MIDDLEWARE
  registrar.middleware(config, app)

  // REGISTER::ROUTERS
  registrar.routers(config.router, app)

  // APP:CREATE::SERVER
  const server = app.listen(config.server.port, config.server.host, async () => {
    // RUN-HOOK::START
    if (config.start) {
      await config.start({ config, app, server })
    }
  })
}
