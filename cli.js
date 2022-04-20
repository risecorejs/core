#! /usr/bin/env node

const commands = require('./commands/index')

const argv = process.argv.slice(2)

const command = argv[0]

void (async () => {
  switch (command) {
    case 'init':
      await commands.init(argv)
      break

    case 'dev':
      commands.dev(argv)
      break

    case 'start':
      commands.start(argv)
      break

    case 'make:controller':
      await commands.makeController(argv)
      break

    case 'make:model':
      await commands.makeModel(argv)
      break

    case 'make:docs':
      await commands.makeDocs(argv)
      break

    case 'make:routes':
      await commands.makeDocs(argv)
      break

    case 'make:entity':
      await commands.makeEntity(argv)
      break

    case 'make:migrations':
      commands.makeMigrations(argv)
      break

    default:
      console.log(`Command "${command}" not found`)
      break
  }
})()
