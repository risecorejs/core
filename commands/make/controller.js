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

    await writeFileWithPrettier(filePath + '/' + fileName, fileContent, 'typescript')

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
  
  import {
    IMethodCreateOptions,
    IMethodFindAllOptions,
    IMethodFindOneOptions,
    IMethodUpdateOptions,
    IMethodDestroyOptions
  } from '@risecorejs/crud-builder/interfaces'
  
  import { ${modelName} } from '../database/models/interfaces'
  
  export = crudBuilder('${modelName}', {
    create,
    index,
    show,
    update,
    destroy
  })
  
  // CREATE
  function create(): IMethodCreateOptions<${modelName}> {
    return {
      template: 'create',
      rules: {
        // your rules
      },
      only: [
        // your fields
      ],
      response: ({ instance: ${modelNameFirstLower} }) => {
        return { ${modelNameFirstLower} }
      }
    }
  }
  
  // INDEX
  function index(): IMethodFindAllOptions<${modelName}> {
    return {
      template: 'index',
      response: ({ instances: ${entityExtendedNameCamelCase} }) => {
        return { ${entityExtendedNameCamelCase} }
      }
    }
  }
  
  // SHOW
  function show(): IMethodFindOneOptions<${modelName}> {
    return {
      template: 'show',
      response: ({ instance: ${modelNameFirstLower} }) => {
        return { ${modelNameFirstLower} }
      }
    }
  }
  
  // UPDATE
  function update(): IMethodUpdateOptions<${modelName}> {
    return {
      template: 'update',
      rules: {
        // your rules
      },
      only: [
        // your fields
      ],
      response: ({ instance: ${modelNameFirstLower} }) => {
        return { ${modelNameFirstLower} }
      }
    }
  }
  
  // DESTROY
  function destroy(): IMethodDestroyOptions<${modelName}> {
    return {
      template: 'destroy',
      response: ({ instance: ${modelNameFirstLower} }) => {
        return { ${modelNameFirstLower} }
      }
    }
  }`
}
