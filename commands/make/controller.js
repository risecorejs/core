const _ = require('lodash')
const path = require('path')
const consola = require('consola')

const writeFileWithPrettier = require('../helpers/write-file-with-prettier')

module.exports = {
  command: 'make:controller [entityName] [entityExtendedName]',
  describe: 'Creating a base controller',
  builder(yargs) {
    yargs.positional('entityName', { describe: 'Entity name', type: 'string' })
    yargs.positional('entityExtendedName', { describe: 'Entity extended name', type: 'string' })

    yargs.option('entityName', { alias: 'en' })
    yargs.option('entityExtendedName', { alias: 'exn' })

    yargs.example([
      ['$0 make:controller UserGroup user-groups'],
      ['$0 make:controller --entityName UserGroup --entityExtendedName user-groups'],
      ['$0 make:controller --en UserGroup --exn user-groups']
    ])

    return yargs
  },
  async handler({ entityName, entityExtendedName }) {
    const filePath = path.resolve('controllers')
    const fileName = _.kebabCase(entityExtendedName) + '.ts'

    const fileContent = getFileContent(entityName, entityExtendedName)

    await writeFileWithPrettier(filePath + '/' + fileName, fileContent)

    consola.success('Controller created: ' + fileName)
  }
}

/**
 * GET-FILE-CONTENT
 * @param entityName {string}
 * @param entityExtendedName {string}
 * @return {string}
 */
function getFileContent(entityName, entityExtendedName) {
  const modelName = _.upperFirst(_.camelCase(entityName))
  const modelNameFirstLower = _.lowerFirst(modelName)
  const entityExtendedNameCamelCase = _.camelCase(entityExtendedName)

  return `import crudBuilder from '@risecorejs/crud-builder'
  
  const endpoints = crudBuilder({
    model: '${modelName}',
    endpoints: {
      create,
      index,
      show,
      update,
      destroy
    }
  })
  
  export = endpoints
  
  // CREATE
  function create() {
    return {
      template: 'create',
      rules: {
        // your rules
      },
      only: [
        // your fields
      ],
      response({ instance: ${modelNameFirstLower} }) {
        return { ${modelNameFirstLower} }
      }
    }
  }
  
  // INDEX
  function index() {
    return {
      template: 'index',
      response(${entityExtendedNameCamelCase}) {
        return { ${entityExtendedNameCamelCase} }
      }
    }
  }
  
  // SHOW
  function show() {
    return {
      template: 'show',
      response(${modelNameFirstLower}) {
        return { ${modelNameFirstLower} }
      }
    }
  }
  
  // UPDATE
  function update() {
    return {
      template: 'update',
      rules: {
        // your rules
      },
      only: [
        // your fields
      ],
      response({ instance: ${modelNameFirstLower} }) {
        return { ${modelNameFirstLower} }
      }
    }
  }
  
  // DESTROY
  function destroy() {
    return {
      template: 'destroy',
      response({ instance: ${modelNameFirstLower} }) {
        return { ${modelNameFirstLower} }
      }
    }
  }`
}
