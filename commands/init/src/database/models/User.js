const { Model } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }

  User.init(
    {
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default'
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          this.setDataValue('password', bcrypt.hashSync(val, 1))
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'user',
      autoMigrations: true,
      paranoid: true,
      scopes: {
        withoutPassword: {
          attributes: {
            exclude: 'password'
          }
        }
      }
    }
  )

  return User
}
