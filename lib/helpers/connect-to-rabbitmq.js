const amqplib = require('amqplib')
const env = require('./env')

module.exports = async (cb) => {
  const connection = await amqplib.connect(env('RABBITMQ_URL', 'amqp://localhost'))
  const channel = await connection.createChannel()

  cb(channel)
}
