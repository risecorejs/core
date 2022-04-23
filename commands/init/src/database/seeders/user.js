const bcrypt = require('bcryptjs')

module.exports = {
  async up(queryInterface, Sequelize) {
    const records = [
      {
        role: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('change-me', 1)
      },
      {
        role: 'manager',
        email: 'manager@example.com',
        password: await bcrypt.hash('change-me', 1)
      },
      {
        role: 'default',
        email: 'user@example.com',
        password: await bcrypt.hash('change-me', 1)
      }
    ]

    for (const record of records) {
      record.updatedAt = new Date()
      record.createdAt = new Date()
    }

    return queryInterface.bulkInsert('user', records)
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {})
  }
}
