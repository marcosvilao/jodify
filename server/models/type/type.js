const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const TypeModel = sequelize.define(
  'Type',
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
  },
  {
    tableName: 'types',
    timestamps: false,
    // createdAt: 'createdat',
    // updatedAt: 'updatedat',
  }
)

module.exports = TypeModel
