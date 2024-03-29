const execa = require('execa')

module.exports = {
  command: 'start [port] [host] [multiprocessing] [multiprocessingWorkers]',
  describe: 'Run server',
  builder(yargs) {
    yargs.positional('port', { describe: 'port to bind on', type: 'number' })
    yargs.positional('host', { describe: 'host to bind on', type: 'string' })
    yargs.positional('multiprocessing', { describe: 'enable multiprocessing', type: 'boolean' })
    yargs.positional('multiprocessingWorkers', { describe: 'number of workers', type: 'number' })

    yargs.option('port', { alias: 'p' })
    yargs.option('host', { alias: 'h' })
    yargs.option('multiprocessing', { alias: 'mp' })
    yargs.option('multiprocessingWorkers', { alias: 'mpw' })

    yargs.example([
      ['$0 dev 5000 localhost true 3'],
      ['$0 dev --port 5000 --host 0.0.0.0 --multiprocessing --multiprocessingWorkers 3'],
      ['$0 dev -p 5000 -h 0.0.0.0 --mp --mpw 3']
    ])

    return yargs
  },
  handler({ port, host, multiprocessing, multiprocessingWorkers }) {
    if (port) process.env.$CLI_PORT = port
    if (host) process.env.$CLI_HOST = host
    if (multiprocessing) process.env.$CLI_MULTIPROCESSING = multiprocessing
    if (multiprocessingWorkers) process.env.$CLI_MULTIPROCESSING_WORKERS = multiprocessingWorkers

    execa(`node ${__dirname}/../start.js`, {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      shell: true
    })
  }
}
