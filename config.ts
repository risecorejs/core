const crudBuilder = require('@risecorejs/crud-builder')

import path from 'path'
import merge from 'merge'
import env from '@risecorejs/helpers/lib/env'

import models from './models'

import { IConfig, IConfigStartCtx } from './interfaces'

const initialConfig: IConfig = {
  global: {
    controller: (filePath: string) => (method: string) => filePath + '.' + method,
    env,
    crudBuilder
  },

  server: {
    host: env('HOST', 'localhost'),
    port: env('PORT', 8000),
    multiprocessing: false,
    multiprocessingWorkers: null
  },

  moduleAlias: {
    '~': path.resolve()
  },

  storage: true,

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
    cors: {},
    extend: () => []
  },

  init(config: IConfig) {},
  master(config: IConfig) {},
  start(ctx: IConfigStartCtx) {}
}

const appConfig = require(path.resolve('config')).default

// MERGE INITIAL-CONFIG AND APP-CONFIG
const { config } = merge.recursive({ config: initialConfig }, { config: appConfig })

export default <
  IConfig & {
    server: {
      host: string
      port: number
      multiprocessing: boolean
      multiprocessingWorkers: number | null
    }

    init: (config: IConfig) => void
    master: (config: IConfig) => void
    start: (ctx: IConfigStartCtx) => void
  }
>config
