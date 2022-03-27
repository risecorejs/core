#! /usr/bin/env node

const execa = require('execa')
const path = require('path')
const rimraf = require('rimraf')

const argv = process.argv.slice(2)

switch (argv[0]) {
  case 'dev':
    run('nodemon')
    break

  case 'start':
    run('node')
    break

  case 'init':
    init()
    break
}

/**
 * RUN
 * @param bin {string}
 */
function run(bin) {
  execa(`${bin} ${__dirname}/start.js`, {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    shell: true
  })
}

/**
 * INIT
 */
function init() {
  execa(`git clone https://github.com/risecorejs/template.git ${argv[1] || '.'}`, {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    shell: true
  }).finally(() => {
    rimraf(path.resolve('.git'), (err) => {
      if (err) {
        console.error(err)
      }
    })
  })
}
