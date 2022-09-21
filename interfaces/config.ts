import { IProcesses } from '@risecorejs/processes-runner/interfaces'
import cors from 'cors'
import express from 'express'
import * as http from 'http'
import { Sequelize } from 'sequelize'
import { IRoute } from '@risecorejs/router/interfaces'

import { IFields } from './index'

// CONFIG
export interface IConfig {
  global?: IFields

  server?: IConfigServer

  moduleAliases?: IConfigModuleAliases

  storage?: boolean

  structs?: false | IConfigStructs

  cron?: IConfigCron

  processes?: IProcesses

  validator?: IConfigValidator

  router?: IConfigRouter | IConfigRouter[]

  middleware?: {
    rateLimit?: false | IFields
    cors?: false | cors.CorsOptions
    extend?: () => express.Handler[]
  }

  init?: (config: IConfig) => void | Promise<void>
  master?: (config: IConfig) => void | Promise<void>
  start?: (ctx: { config: IConfig; app: express.Application; server: http.Server }) => void | Promise<void>
}

// CONFIG-CORE
export interface IConfigCore extends IConfig {
  server: Required<IConfigServer>

  structs: false | Required<IConfigStructs>

  validator: IConfigValidator

  router: IConfigRouter | IConfigRouter[]

  middleware: {
    rateLimit: false | IFields
    cors: false | cors.CorsOptions
    extend?: () => express.Handler[]
  }
}

// CONFIG-SERVER
export interface IConfigServer {
  host?: string
  port?: number
  multiprocessing?: boolean
  multiprocessingWorkers?: number
}

// CONFIG-MODULE-ALIASES
export interface IConfigModuleAliases {
  [alias: string]: string
}

// CONFIG-STRUCTS
export interface IConfigStructs {
  setGlobal?: boolean
  enableAPI?: boolean
  dir?: string
}

// CONFIG-CRON
export interface IConfigCron {
  childProcess?: boolean
  jobs: IConfigCronJobs
}

// CONFIG-JOBS
export interface IConfigCronJobs {
  [key: string]: () => void
}

// CONFIG-VALIDATOR
export interface IConfigValidator {
  locale?: 'ru' | 'en'
  sequelize?: Sequelize
}

// CONFIG-ROUTER
export interface IConfigRouter {
  type?: 'pending' | 'local' | 'remote'
  status?: 'pending' | 'connected' | 'reconnecting'
  main?: boolean
  baseUrl?: string
  routesDir?: string
  routesUrl?: string
  middleware?: express.Handler | string | (express.Handler | string)[]
  controller?: express.Handler | string
  apiDocs?: {
    title?: string
    baseUrl?: string
  }
  routes?: IRoute[]
  timeout?: number
}
