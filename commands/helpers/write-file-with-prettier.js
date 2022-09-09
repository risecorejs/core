const fs = require('fs/promises')
const prettier = require('prettier')

/**
 * WRITE-FILE-WITH-PRETTIER
 * @param filePath {string}
 * @param fileContent {string}
 * @param parser {string}
 */
module.exports = async (filePath, fileContent, parser = 'babel') => {
  await fs.writeFile(
    filePath,
    prettier.format(fileContent, {
      trailingComma: 'none',
      tabWidth: 2,
      semi: false,
      singleQuote: true,
      printWidth: 120,
      parser
    })
  )
}
