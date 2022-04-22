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
  .command(commands.makers.controller)
  .command(commands.makers.model)
  .command(commands.makers.docs)
  .command(commands.makers.routes)
  .command(commands.makers.entity)
  .command(commands.makers.migrations)
  .alias('version', 'v')
  .parse()
