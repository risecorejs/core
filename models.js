const { Sequelize, DataTypes } = require('sequelize')
const path = require('path')
const fs = require('fs')

const env = require(__dirname + '/helpers/global/env')

const configPath = path.resolve('database', 'config')

const config = require(configPath)[env('NODE_ENV', 'development')]

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

const db = {}

const modelDir = path.resolve('database', 'models')

for (const file of fs.readdirSync(modelDir)) {
  const modelPath = path.join(modelDir, file)

  const Model = require(modelPath)

  db[Model.name] = Model(sequelize, DataTypes)

  if (db[Model.name].associate) {
    db[Model.name].associate(db)
  }
}

module.exports = { ...db, Sequelize, sequelize }
