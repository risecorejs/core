require('dotenv').config()

import { env } from '@risecorejs/helpers'

const mode = env('NODE_ENV', 'development')

export = {
  [mode]: {
    dialect: env('DB_DIALECT'),
    host: env('DB_HOST'),
    port: env('DB_PORT'),
    database: env('DB_NAME'),
    username: env('DB_USERNAME'),
    password: env('DB_PASSWORD'),
    logging: ['1', 'true'].includes(env('DB_LOGGING'))
  }
}
