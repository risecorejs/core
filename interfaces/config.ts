import express from 'express'
import * as http from 'http'
import { Sequelize } from 'sequelize'
import { IProcesses } from '@risecorejs/processes-runner/interfaces'
import cors from 'cors'

import { TConfigRouter } from '../types'

export interface IConfig {
  global?: {
    [key: string]: any
  }

  server?: IConfigServer

  moduleAlias?: IConfigModuleAlias

  storage?: boolean

  structs?: IConfigStructs | false

  cron?: IConfigCron

  processes?: IProcesses

  validator?: IConfigValidator

  router?: TConfigRouter | TConfigRouter[]

  middleware?: {
    rateLimit?: {
      windowMs?: number
      max?: number
    }
    cors?: cors.CorsOptions
    extend?: () => express.Handler[]
  }

  init?: (config: IConfig) => void | Promise<void>
  master?: (config: IConfig) => void | Promise<void>
  start?: (ctx: IConfigStartCtx) => void | Promise<void>
}

export interface IConfigCore extends Required<IConfig> {}

export interface IConfigServer {
  host?: string
  port?: number
  multiprocessing?: boolean
  multiprocessingWorkers?: number
}

export interface IConfigModuleAlias {
  [alias: string]: string
}

export interface IConfigStructs {
  setGlobal?: boolean
  enableAPI?: boolean
  dir?: string
}

export interface IConfigCron {
  childProcess?: boolean
  jobs: {
    [key: string]: () => void
  }
}

export interface IConfigValidator {
  locale?: 'ru' | 'en'
  sequelize?: Sequelize
}

export interface IConfigStartCtx {
  config: IConfig
  app: express.Application
  server: http.Server
}
