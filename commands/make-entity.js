const makers = require('../makers/index')

module.exports = async (argv) => {
  const entityName = argv[1]
  const entityExtendedName = argv[2]

  await makers.controller(entityName, entityExtendedName)
  await makers.model(entityName)
  await makers.docs(entityName, entityExtendedName)
  await makers.routes(entityExtendedName)

  console.log(`New entity "${entityName}" added successfully!`)

  process.exit(0)
}
