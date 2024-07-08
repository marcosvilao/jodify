const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const DjModel = sequelize.define(
  'Dj',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'djs',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat',
  }
)

module.exports = DjModel
