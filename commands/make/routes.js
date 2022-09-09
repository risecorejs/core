const _ = require('lodash')
const path = require('path')
const consola = require('consola')

const writeFileWithPrettier = require('../helpers/write-file-with-prettier')

module.exports = {
  command: 'make:routes [entityExtendedName]',
  describe: 'Creating a base routes',
  builder(yargs) {
    yargs.positional('entityExtendedName', { describe: 'Entity extended name', type: 'string' })

    yargs.option('entityExtendedName', { alias: 'exn' })

    yargs.example([
      ['$0 make:routes user-groups'],
      ['$0 make:routes --entityExtendedName user-groups'],
      ['$0 make:routes --exn user-groups']
    ])

    return yargs
  },
  async handler({ entityExtendedName }) {
    const filePath = path.resolve('routes')
    const fileName = _.kebabCase(entityExtendedName) + '.ts'

    const fileContent = getFileContent(entityExtendedName)

    await writeFileWithPrettier(filePath + '/' + fileName, fileContent, 'typescript')

    consola.success('Routes created: ' + fileName)
  }
}

/**
 * GET-FILE-CONTENT
 * @param entityExtendedName {string}
 * @return {string}
 */
function getFileContent(entityExtendedName) {
  const entityExtendedNameKebabCase = _.kebabCase(entityExtendedName)
  const groupText = _.upperFirst(_.lowerCase(entityExtendedName))

  return `import { pagination, paramsIsNotNaN } from '@risecorejs/middleware'
  import { IRoute } from '@risecorejs/router/interfaces'

  import docs from '../docs/${entityExtendedNameKebabCase}'
  
  const endpoint = $controller('${entityExtendedNameKebabCase}')
  
  export default <\IRoute\>{
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
