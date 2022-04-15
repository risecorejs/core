const register = require('../register')
const config = require('../config')

register.cron(config.cron.jobs)
