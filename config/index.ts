import path from 'path'
import merge from 'merge'
import { env } from '@risecorejs/helpers'
import * as os from 'os'

const initialConfig = require('./initial').default
const appConfig = require(path.resolve('config')).default

import { IConfigCore } from '../interfaces'

const { config }: { config: IConfigCore } = merge.recursive({ config: initialConfig }, { config: appConfig })

if (env('$CLI_HOST')) {
  config.server.host = env('$CLI_HOST')
}

if (env('$CLI_PORT')) {
  config.server.port = env('$CLI_PORT', Number)
}

if (env('$CLI_MULTIPROCESSING')) {
  config.server.multiprocessing = true
}

if (config.server.multiprocessing) {
  if (env('$CLI_MULTIPROCESSING_WORKERS')) {
    config.server.multiprocessingWorkers = env('$CLI_MULTIPROCESSING_WORKERS', Number)
  }

  config.server.multiprocessingWorkers ||= os.cpus().length - 1
}

export default config
