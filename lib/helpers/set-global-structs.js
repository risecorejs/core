const fs = require('fs')
const path = require('path')
const _ = require('lodash')

module.exports = (dir) => {
  global.$structs = {}

  dir ||= path.resolve('structs')

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const stat = fs.statSync(dir + '/' + file)

    if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.json'))) {
      const key = _.camelCase(path.parse(file).name)

      $structs[key] = require(dir + '/' + file)
    }
  }

  Object.freeze($structs)
}
