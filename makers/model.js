const _ = require('lodash')
const path = require('path')
const fs = require('fs/promises')
const prettier = require('prettier')

module.exports = async (modelName) => {
  const filePath = path.resolve('database', 'models')
  const fileName = _.upperFirst(_.camelCase(modelName)) + '.js'

  const rawModel = getRawModel(modelName)

  await fs.writeFile(
    filePath + '/' + fileName,
    prettier.format(rawModel, {
      trailingComma: 'none',
      tabWidth: 2,
      semi: false,
      singleQuote: true,
      printWidth: 120,
      parser: 'babel'
    })
  )

  console.log('Model created: ' + fileName)
}

/**
 * GET-RAW-MODEL
 * @param modelName {string}
 * @return {string}
 */
function getRawModel(modelName) {
  const className = _.upperFirst(_.camelCase(modelName))

  return `const { Model } = require('sequelize')

  module.exports = (sequelize, DataTypes) => {
    class ${className} extends Model {
      static associate(models) {}
    }
  
    ${className}.init(
      {
        // your columns
      },
      {
        sequelize,
        modelName: '${className}',
        tableName: '${_.snakeCase(modelName)}',
        autoMigrations: true
      }
    )
  
    return ${className}
  }`
}
