const _ = require('lodash')
const path = require('path')
const consola = require('consola')

const writeFileWithPrettier = require('../helpers/write-file-with-prettier')

module.exports = {
  command: 'make:docs [entityName] [entityExtendedName]',
  describe: 'Creating a base docs',
  builder(yargs) {
    yargs.positional('entityName', { describe: 'Entity name', type: 'string' })
    yargs.positional('entityExtendedName', { describe: 'Entity extended name', type: 'string' })

    yargs.option('entityName', { alias: 'en' })
    yargs.option('entityExtendedName', { alias: 'exn' })

    yargs.example([
      ['$0 make:docs UserGroup user-groups'],
      ['$0 make:docs --entityName UserGroup --entityExtendedName user-groups'],
      ['$0 make:docs --en UserGroup --exn user-groups']
    ])

    return yargs
  },
  async handler({ entityName, entityExtendedName }) {
    const filePath = path.resolve('docs')
    const fileName = _.kebabCase(entityExtendedName) + '.ts'

    const fileContent = getFileContent(entityName, entityExtendedName)

    await writeFileWithPrettier(filePath + '/' + fileName, fileContent, 'typescript')

    consola.success('Docs created: ' + fileName)
  }
}

/**
 * GET-FILE-CONTENT
 * @param entityName {string}
 * @param entityExtendedName {string}
 * @return {string}
 */
function getFileContent(entityName, entityExtendedName) {
  const entityNameLowerCase = _.lowerCase(entityName)
  const entityExtendedNameLowerCase = _.lowerCase(entityExtendedName)

  return `// CREATE
  export const create = {
    private: true,
    description: 'Create new ${entityNameLowerCase}',
    bodyUI: true,
    body: {
      // your fields
    }
  }
  
  // INDEX
  export const index = {
    private: true,
    description: 'Show all ${entityExtendedNameLowerCase} with pagination'
  }
  
  // SHOW
  export const show = {
    private: true,
    description: 'Show ${entityNameLowerCase} by ID'
  }
  
  // UPDATE
  export const update = {
    private: true,
    description: 'Update ${entityNameLowerCase} by ID',
    bodyUI: true,
    body: {
      // your fields
    }
  }
  
  // DESTROY
  export const destroy = {
    private: true,
    description: 'Destroy ${entityNameLowerCase} by ID'
  }`
}
