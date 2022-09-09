const path = require('path')
const fs = require('fs/promises')
const consola = require('consola')

module.exports = {
  command: 'init [folder]',
  describe: 'Init Risecorejs template',
  builder(yargs) {
    yargs.positional('folder', { describe: 'Folder name', type: 'string' })

    yargs.option('folder', { alias: 'f' })
    yargs.option('dockerFiles', { alias: 'df', describe: 'Include docker files' })

    yargs.example([['$0 init .'], ['$0 init my-project'], ['$0 init --folder my-project'], ['$0 init -f my-project']])

    return yargs
  },
  async handler({ folder, dockerFiles }) {
    const basePath = folder === '.' ? path.resolve() : path.resolve(folder)

    const baseStructTemplate = getBaseStructTemplate()

    // BASE-DIRECTORIES
    {
      for (const directory of baseStructTemplate.baseDirectories) {
        await fs.mkdir(basePath + '/' + directory, { recursive: true })
      }

      consola.success('Base directories have been created successfully')
    }

    // BASE-FILES
    {
      for (const filePath of baseStructTemplate.baseFiles) {
        if (typeof filePath === 'function') {
          const { inputPath, outputPath } = filePath()

          const fileContent = await fs.readFile(__dirname + '/src/' + inputPath)

          await fs.writeFile(basePath + '/' + outputPath, fileContent)
        } else {
          await writeFile(basePath, filePath)
        }
      }

      consola.success('Base files have been created successfully')
    }

    // README-FILES
    {
      for (const filePath of baseStructTemplate.readmeFiles) {
        await writeFile(basePath, filePath)
      }

      consola.success('Readme files have been created successfully')
    }

    // DOCKER-FILES
    if (dockerFiles) {
      for (const filePath of baseStructTemplate.dockerFiles) {
        await writeFile(basePath, filePath)
      }

      consola.success('Docker files have been created successfully')
    }

    consola.info('Base template deployment complete!')
  }
}

/**
 * GET-BASE-STRUCT-TEMPLATE
 * @returns {{
 *   baseDirectories: string[],
 *   baseFiles: (string|(function(): {inputPath: string, outputPath: string}))[],
 *   readmeFiles: string[],
 *   dockerFiles: string[]
 * }}
 */
function getBaseStructTemplate() {
  return {
    baseDirectories: [
      'controllers',

      'database/joins',
      'database/migrations',
      'database/models',
      'database/order-by',
      'database/seeders',

      'docs',
      'middleware',
      'routes',
      'storage',
      'structs'
    ],
    baseFiles: [
      'database/config.js',

      '.env.example',
      () => ({ inputPath: 'gitignore', outputPath: '.gitignore' }),
      '.prettierrc.json',
      '.sequelizerc',
      'config.js',
      'package.json'
    ],
    readmeFiles: [
      'controllers/README.md',

      'database/joins/README.md',
      'database/migrations/README.md',
      'database/models/README.md',
      'database/order-by/README.md',
      'database/seeders/README.md',

      'docs/README.md',
      'middleware/README.md',
      'routes/README.md',
      'storage/README.md',
      'structs/README.md',

      'README.md'
    ],
    dockerFiles: ['.dockerignore', 'Dockerfile']
  }
}

/**
 * WRITE-FILE
 * @param basePath {string}
 * @param filePath {string}
 * @returns {Promise<void>}
 */
async function writeFile(basePath, filePath) {
  const fileContent = await fs.readFile(__dirname + '/src/' + filePath)

  await fs.writeFile(basePath + '/' + filePath, fileContent)
}
