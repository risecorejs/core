#! /usr/bin/env node

const execa = require('execa')
const path = require('path')
const rimraf = require('rimraf')

const std = {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr
}

const argv = process.argv.slice(2)

function start(bin) {
  execa(bin, [__dirname + '/start.js'], std)
}

function init() {
  execa('git', ['clone', 'https://github.com/risecorejs/template.git', argv[1] || '.'], std).finally(() => {
    rimraf(path.resolve('.git'), (err) => {
      if (err) console.log(err)
    })
  })
}

switch (argv[0]) {
  case 'dev':
    start('nodemon')
    break

  case 'start':
    start('node')
    break

  case 'init':
    init()
    break

  default:
    break
}
