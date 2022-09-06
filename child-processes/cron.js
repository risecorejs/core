const register = require('../register').default
const config = require('../config').default

register.cron(config.cron.jobs)
