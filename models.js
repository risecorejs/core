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

  const Model = require(modelPath)(sequelize, DataTypes)

  db[Model.name] = Model
}

for (const key in db) {
  if (!db.hasOwnProperty(key) && !db[key].associate) continue

  db[key].associate(db)
}

module.exports = { ...db, Sequelize, sequelize }
