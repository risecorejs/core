const moduleAlias = require('module-alias')

const express = require('express')
const path = require('path')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const only = require('@risecorejs/only')
const validator = require('@risecorejs/validator')
const whereBuilder = require('@risecorejs/where-builder')

const models = require('./models')
const addRouter = require('./utils/add-router')

// MODULE-ALIAS
exports.moduleAlias = (aliases) => moduleAlias.addAliases(aliases)

// GLOBAL-VARIABLES
exports.globalVariables = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    global['$' + key] = value
  }
}

// MIDDLEWARE
exports.middleware = async (config, app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/storage', express.static(path.resolve('storage')))

  if (config.middleware.rateLimit) {
    app.use(rateLimit(config.middleware.rateLimit))
  }

  if (config.middleware.cors) {
    app.use(cors(config.middleware.cors))
  }

  app.use(only())

  app.use(
    validator({
      sequelize: models.sequelize,
      ...(config.middleware.validator || {})
    })
  )

  app.use(whereBuilder())

  const customMiddleware = config.middleware.extend()

  if (customMiddleware?.length) {
    for (const middleware of customMiddleware) {
      app.use(middleware)
    }
  }

  if (Array.isArray(config.middleware.router)) {
    for (const configRouter of config.middleware.router) {
      await pushRouter(configRouter, app)
    }
  } else {
    await pushRouter(config.middleware.router, app)
  }
}

/**
 * PUSH-ROUTER
 * @param config {Object}
 * @param app {Object}
 */
async function pushRouter(config, app) {
  try {
    await addRouter(config, app)
  } catch (error) {
    console.error(error)

    setTimeout(() => pushRouter(config, app), 5000)
  }
}
