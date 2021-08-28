const { Sequelize, DataTypes } = require('sequelize')
const path = require('path')
const fs = require('fs')

const config = require(path.resolve('database', 'config'))

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

const db = {}

for (const file of fs.readdirSync(path.resolve('database', 'models'))) {
  const Model = require(path.resolve('database', 'models', file))

  db[Model.name] = Model(sequelize, DataTypes)

  if (db[Model.name].associate) {
    db[Model.name].associate(db)
  }
}

module.exports = { ...db, Sequelize, sequelize }
