const { Sequelize, DataTypes } = require('sequelize')
const path = require('path')
const fs = require('fs')

const env = require('./env')

module.exports = (options) => {
  const configPath = path.resolve(...(options.configPath ?? ['database', 'config']))

  let config = require(configPath)

  config = options.NODE_ENV === false ? config : config[options.NODE_ENV ?? env('NODE_ENV', 'development')]

  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  const db = {}

  const modelDir = path.resolve(...(options.modelDir ?? ['database', 'models']))

  for (const file of fs.readdirSync(modelDir)) {
    const modelPath = path.join(modelDir, file)

    const Model = require(modelPath)(sequelize, DataTypes)

    db[Model.name] = Model
  }

  for (const key in db) {
    if (!db.hasOwnProperty(key) && !db[key].associate) continue

    db[key].associate(db)
  }

  return { ...db, Sequelize, sequelize }
}
