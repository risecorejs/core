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
  const middleware = []

  middleware.push(express.json())
  middleware.push(express.urlencoded({ extended: true }))
  middleware.push(['/storage', express.static(path.resolve('storage'))])

  if (config.middleware.rateLimit) {
    middleware.push(rateLimit(config.middleware.rateLimit))
  }

  if (config.middleware.cors) {
    middleware.push(cors(config.middleware.cors))
  }

  middleware.push(only())
  middleware.push(
    validator({
      sequelize: models.sequelize,
      ...(config.middleware.validator || {})
    })
  )
  middleware.push(whereBuilder())
  middleware.push(...config.middleware.extend())

  if (Array.isArray(config.middleware.router)) {
    for (const configRouter of config.middleware.router) {
      await pushRouter(configRouter, middleware)
    }
  } else {
    await pushRouter(config.middleware.router, middleware)
  }

  for (const _middleware of middleware) {
    if (_middleware) {
      app.use(...(Array.isArray(_middleware) ? _middleware : [_middleware]))
    }
  }
}

/**
 * PUSH-ROUTER
 * @param config {Object}
 * @param middleware {Object}
 */
async function pushRouter(config, middleware) {
  try {
    await addRouter(config, middleware)
  } catch (error) {
    console.error(error)

    setTimeout(() => pushRouter(config, middleware), 5000)
  }
}
