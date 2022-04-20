const makeController = require('../makers/make-controller')
const makeModel = require('../makers/make-model')
const makeDocs = require('../makers/make-docs')
const makeRoutes = require('../makers/make-routes')

module.exports = async (argv) => {
  const entityName = argv[1]
  const entityExtendedName = argv[2]

  await makeController(entityName, entityExtendedName)
  await makeModel(entityName)
  await makeDocs(entityName, entityExtendedName)
  await makeRoutes(entityExtendedName)

  console.log(`New entity "${entityName}" added successfully!`)

  process.exit(0)
}
