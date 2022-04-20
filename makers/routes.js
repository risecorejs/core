const _ = require('lodash')
const path = require('path')
const fs = require('fs/promises')
const prettier = require('prettier')

module.exports = async (entityExtendedName) => {
  const filePath = path.resolve('routes')
  const fileName = _.kebabCase(entityExtendedName) + '.js'

  const rawRoutes = getRawRoutes(entityExtendedName)

  await fs.writeFile(
    filePath + '/' + fileName,
    prettier.format(rawRoutes, {
      trailingComma: 'none',
      tabWidth: 2,
      semi: false,
      singleQuote: true,
      printWidth: 120,
      parser: 'babel'
    })
  )

  console.log('Routes created: ' + fileName)
}

/**
 * GET-RAW-ROUTES
 * @param entityExtendedName {string}
 * @return {string}
 */
function getRawRoutes(entityExtendedName) {
  const entityExtendedNameKebabCase = _.kebabCase(entityExtendedName)
  const groupText = _.upperFirst(_.lowerCase(entityExtendedName))

  return `const { pagination, paramsIsNotNaN } = require('@risecorejs/middleware')

  const docs = require('../docs/${entityExtendedNameKebabCase}')
  
  const endpoint = $controller('${entityExtendedNameKebabCase}')
  
  module.exports = {
    group: '${groupText}',
    url: '/${entityExtendedNameKebabCase}',
    children: [
      // CREATE
      {
        method: 'POST',
        url: '/',
        controller: endpoint('create'),
        docs: docs.create
      },
      // INDEX
      {
        method: 'GET',
        url: '/',
        middleware: pagination,
        controller: endpoint('index'),
        docs: docs.index
      },
      // SHOW
      {
        method: 'GET',
        url: '/:id',
        controller: endpoint('show'),
        docs: docs.show
      },
      // UPDATE
      {
        method: 'PUT',
        url: '/:id',
        middleware: paramsIsNotNaN('id'),
        controller: endpoint('update'),
        docs: docs.update
      },
      // DESTROY
      {
        method: 'DELETE',
        url: '/:id',
        middleware: paramsIsNotNaN('id'),
        controller: endpoint('destroy'),
        docs: docs.destroy
      }
    ]
  }`
}
