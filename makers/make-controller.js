const _ = require('lodash')
const path = require('path')
const fs = require('fs/promises')
const prettier = require('prettier')

module.exports = async (entityName, entityExtendedName) => {
  const filePath = path.resolve('controllers')
  const fileName = _.kebabCase(entityExtendedName) + '.js'

  const rawController = getRawController(entityName, entityExtendedName)

  await fs.writeFile(
    filePath + '/' + fileName,
    prettier.format(rawController, {
      trailingComma: 'none',
      tabWidth: 2,
      semi: false,
      singleQuote: true,
      printWidth: 120,
      parser: 'babel'
    })
  )

  console.log('Controller created: ' + fileName)
}

/**
 * GET-RAW-CONTROLLER
 * @param entityName {string}
 * @param entityExtendedName {string}
 * @return {string}
 */
function getRawController(entityName, entityExtendedName) {
  const modelName = _.upperFirst(_.camelCase(entityName))
  const modelNameFirstLower = _.lowerFirst(modelName)
  const entityExtendedNameCamelCase = _.camelCase(entityExtendedName)

  return `const endpoints = $crudBuilder({
    model: '${modelName}',
    endpoints: {
      create,
      index,
      show,
      update,
      destroy
    }
  })
  
  module.exports = endpoints
  
  // CREATE
  function create() {
    return {
      rules: {
        // your rules
      },
      fields: [
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
      response(${entityExtendedNameCamelCase}) {
        return { ${entityExtendedNameCamelCase} }
      }
    }
  }
  
  // SHOW
  function show() {
    return {
      response(instance: ${modelNameFirstLower}) {
        return { ${modelNameFirstLower} }
      }
    }
  }
  
  // UPDATE
  function update() {
    return {
      rules: {
        // your rules
      },
      fields: [
        // your fields
      ],
      response(instance: ${modelNameFirstLower}) {
        return { ${modelNameFirstLower} }
      }
    }
  }
  
  // DESTROY
  function destroy() {
    return {
      response(instance: ${modelNameFirstLower}) {
        return { ${modelNameFirstLower} }
      }
    }
  }`
}
