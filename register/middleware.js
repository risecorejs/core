const express = require('express')
const path = require('path')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const only = require('@risecorejs/only/middleware')
const validator = require('@risecorejs/validator')
const whereBuilder = require('@risecorejs/where-builder/middleware')

module.exports = (config, app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  if (config.storage) {
    app.use('/storage', express.static(path.resolve('storage')))
  }

  if (config.middleware.rateLimit) {
    app.use(rateLimit(config.middleware.rateLimit))
  }

  if (config.middleware.cors) {
    app.use(cors(config.middleware.cors))
  }

  app.use(only())
  app.use(validator(config.middleware.validator))
  app.use(whereBuilder())

  const customMiddleware = config.middleware.extend()

  if (customMiddleware.length) {
    for (const middleware of customMiddleware) {
      app.use(middleware)
    }
  }
}
