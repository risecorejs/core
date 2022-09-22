const _ = require('lodash')
const path = require('path')
const fs = require('fs/promises')
const consola = require('consola')

const writeFileWithPrettier = require('../helpers/write-file-with-prettier')

module.exports = {
  command: 'make:model [entityName]',
  describe: 'Creating a base model',
  builder(yargs) {
    yargs.positional('entityName', { describe: 'Entity name', type: 'string' })

    yargs.option('entityName', { alias: 'en' })

    yargs.example([
      ['$0 make:model UserGroup'],
      ['$0 make:model --entityName UserGroup'],
      ['$0 make:model --en UserGroup']
    ])

    return yargs
  },
  async handler({ entityName }) {
    const baseDir = path.resolve('database', 'models')

    const modelName = _.upperFirst(_.camelCase(entityName))

    const modelContent = getModelContent(modelName)

    await writeFileWithPrettier(path.join(baseDir, modelName) + '.js', modelContent)

    const modelInterfaceContent = getModelInterfaceContent(modelName)

    await writeFileWithPrettier(path.join(baseDir, 'interfaces', modelName) + '.ts', modelInterfaceContent)

    await updateModelInterfaces(path.join(baseDir, 'interfaces'))

    consola.success('Model created: ' + modelName)
  }
}

/**
 * GET-MODEL-CONTENT
 * @param modelName {string}
 * @return {string}
 */
function getModelContent(modelName) {
  return `const { Model, DataTypes } = require('sequelize')

  module.exports = (sequelize) => {
    class ${modelName} extends Model {
      static associate(models) {}
    }
  
    ${modelName}.init(
      {
        // your columns
      },
      {
        sequelize,
        modelName: '${modelName}',
        tableName: '${_.snakeCase(modelName)}',
        autoMigrations: true
      }
    )
  
    return ${modelName}
  }`
}

/**
 * GET-MODEL-INTERFACE-CONTENT
 * @param modelName {string}
 * @return {string}
 */
function getModelInterfaceContent(modelName) {
  return `import { Model } from 'sequelize'
  
  export interface ${modelName} extends Model {
    // your columns
  }`
}

/**
 * UPDATE-MODEL-INTERFACES
 * @param baseDir {string}
 * @return {Promise<void>}
 */
async function updateModelInterfaces(baseDir) {
  const files = await fs.readdir(baseDir)

  const modelInterfaces = []

  for (const file of files) {
    if (path.extname(file) === '.ts' && !file.endsWith('.d.ts') && file !== 'index.ts') {
      modelInterfaces.push(`export * from './${path.parse(file).name}'`)
    }
  }

  await writeFileWithPrettier(path.join(baseDir, 'index') + '.ts', modelInterfaces.join(';'), 'typescript')
}
