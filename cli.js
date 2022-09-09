#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const commands = require('./commands')

yargs(hideBin(process.argv))
  .scriptName('risecorejs')
  .usage('$0 <command> [options]')
  .command(commands.init)
  .command(commands.dev)
  .command(commands.start)
  .command(commands.make.controller)
  .command(commands.make.model)
  .command(commands.make.docs)
  .command(commands.make.routes)
  .command(commands.make.entity)
  .command(commands.make.migrations)
  .alias('version', 'v')
  .parse()
