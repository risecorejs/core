const rateLimit = require('express-rate-limit')

import express from 'express'
import cors from 'cors'
import path from 'path'
import only from '@risecorejs/only/middleware'
import validator from '@risecorejs/validator/middleware'
import orderBuilder from '@risecorejs/order-builder/middleware'
import whereBuilder from '@risecorejs/where-builder/middleware'
import includeBuilder from '@risecorejs/include-builder/middleware'

import { IConfigCore } from '../interfaces'

export default function (config: IConfigCore, app: express.Application) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  if (config.middleware.rateLimit) {
    app.use(rateLimit(config.middleware.rateLimit))
  }

  if (config.middleware.cors) {
    app.use(cors(config.middleware.cors))
  }

  if (config.storage) {
    app.use('/storage', express.static(path.resolve('storage')))
  }

  app.use(only())
  app.use(validator(config.validator))
  app.use(orderBuilder())
  app.use(whereBuilder())
  app.use(includeBuilder())

  if (config.middleware.extend) {
    const middleware = config.middleware.extend()

    if (middleware.length) {
      for (const item of middleware) {
        app.use(item)
      }
    }
  }
}
