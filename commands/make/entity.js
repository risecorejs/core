const consola = require('consola')

module.exports = {
  command: 'make:entity [entityName] [entityExtendedName]',
  describe: 'Creating a base entity',
  builder(yargs) {
    yargs.positional('entityName', { describe: 'Entity name', type: 'string' })
    yargs.positional('entityExtendedName', { describe: 'Entity extended name', type: 'string' })

    yargs.option('entityName', { alias: 'en' })
    yargs.option('entityExtendedName', { alias: 'exn' })

    yargs.example([
      ['$0 make:entity UserGroup user-groups'],
      ['$0 make:entity --entityName UserGroup --entityExtendedName user-groups'],
      ['$0 make:entity --en UserGroup --exn user-groups']
    ])

    return yargs
  },
  async handler({ entityName, entityExtendedName }) {
    const make = require('./')

    await make.controller.handler({ entityName, entityExtendedName })
    await make.model.handler({ entityName })
    await make.docs.handler({ entityName, entityExtendedName })
    await make.routes.handler({ entityExtendedName })

    consola.info(`New entity "${entityName}" added successfully!`)
  }
}
