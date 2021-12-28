const moduleAlias = require('module-alias')

const express = require('express')
const path = require('path')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const only = require('@risecorejs/only')
const validator = require('@risecorejs/validator')
const whereBuilder = require('@risecorejs/where-builder')

const models = require(__dirname + '/models')
const addRouter = require(__dirname + '/helpers/add-router')

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
      try {
        await addRouter(configRouter, middleware)
      } catch (error) {
        console.error(error)
      }
    }
  } else {
    try {
      await addRouter(config.middleware.router, middleware)
    } catch (error) {
      console.error(error)
    }
  }

  for (const _middleware of middleware) {
    if (_middleware) {
      app.use(...(Array.isArray(_middleware) ? _middleware : [_middleware]))
    }
  }
}
