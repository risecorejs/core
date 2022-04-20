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
      await commands.makers.controller(argv)
      break

    case 'make:model':
      await commands.makers.model(argv)
      break

    case 'make:docs':
      await commands.makers.docs(argv)
      break

    case 'make:routes':
      await commands.makers.docs(argv)
      break

    case 'make:entity':
      await commands.makers.entity(argv)
      break

    case 'make:migrations':
      commands.makers.migrations(argv)
      break

    default:
      console.log(`Command "${command}" not found`)
      break
  }
})()
