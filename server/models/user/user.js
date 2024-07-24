const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const UserModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    promoter_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    clerk_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat',
  }
)

module.exports = UserModel
