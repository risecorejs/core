import { env } from '@risecorejs/helpers'
import path from 'path'

import models from '../models'

import { IConfig } from '../interfaces/config'

export default <IConfig>{
  server: {
    host: env('HOST', 'localhost'),
    port: env('PORT', 8000)
  },

  structs: {
    setGlobal: true,
    enableAPI: true,
    dir: path.resolve('structs')
  },

  validator: {
    locale: 'en',
    sequelize: models.sequelize
  },

  router: {
    baseUrl: '/',
    routesPath: '/routes',
    apiDocs: {
      title: 'API-docs'
    }
  },

  middleware: {
    rateLimit: {
      windowMs: 5 * 60 * 1000,
      max: 1000
    },
    cors: {}
  }
}
