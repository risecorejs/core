const _ = require('lodash')
const path = require('path')
const fs = require('fs/promises')
const prettier = require('prettier')

module.exports = async (entityName, entityExtendedName) => {
  const filePath = path.resolve('docs')
  const fileName = _.kebabCase(entityExtendedName) + '.js'

  const rawDocs = getRawDocs(entityName, entityExtendedName)

  await fs.writeFile(
    filePath + '/' + fileName,
    prettier.format(rawDocs, {
      trailingComma: 'none',
      tabWidth: 2,
      semi: false,
      singleQuote: true,
      printWidth: 120,
      parser: 'babel'
    })
  )

  console.log('Docs created: ' + fileName)
}

/**
 * GET-RAW-DOCS
 * @param entityName {string}
 * @param entityExtendedName {string}
 * @return {string}
 */
function getRawDocs(entityName, entityExtendedName) {
  const entityNameLowerCase = _.lowerCase(entityName)
  const entityExtendedNameLowerCase = _.lowerCase(entityExtendedName)

  return `// CREATE
  exports.create = {
    private: true,
    description: 'Create new ${entityNameLowerCase}',
    bodyUI: true,
    body: {
      // your fields
    }
  }
  
  // INDEX
  exports.index = {
    private: true,
    description: 'Show all ${entityExtendedNameLowerCase} with pagination'
  }
  
  // SHOW
  exports.show = {
    private: true,
    description: 'Show ${entityNameLowerCase} by ID'
  }
  
  // UPDATE
  exports.update = {
    private: true,
    description: 'Update ${entityNameLowerCase} by ID',
    bodyUI: true,
    body: {
      // your fields
    }
  }
  
  // DESTROY
  exports.destroy = {
    private: true,
    description: 'Destroy ${entityNameLowerCase} by ID'
  }`
}
