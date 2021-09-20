const moduleAlias = require('module-alias')

const packageJson = require(__dirname + '/package.json')

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
exports.middleware = (config, app) => {
  const configRateLimit = config.middleware.rateLimit
  const configCors = config.middleware.cors
  const configValidator = config.middleware.validator || {}
  const configRouter = config.middleware.router

  app.get('/', (req, res) => res.send(`${packageJson.description} v${packageJson.version}`))

  const middleware = [
    express.json(),
    express.urlencoded({ extended: true }),
    ['/storage', express.static(path.resolve('storage'))],
    !!configRateLimit && rateLimit(configRateLimit),
    !!configCors && cors(configCors),
    only(),
    validator({ sequelize: models.sequelize, ...configValidator }),
    whereBuilder()
  ]

  middleware.push(...config.middleware.extend())

  if (Array.isArray(configRouter)) {
    for (const _configRouter of configRouter) {
      addRouter(_configRouter, middleware)
    }
  } else {
    addRouter(configRouter, middleware)
  }

  for (const _middleware of middleware) {
    if (_middleware) {
      app.use(...(Array.isArray(_middleware) ? _middleware : [_middleware]))
    }
  }
}
