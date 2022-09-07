const registrar = require('../registrar')
const config = require('../config')

registrar.cron(config.cron.jobs)
