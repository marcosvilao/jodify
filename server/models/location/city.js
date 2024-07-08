const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const CityModel = sequelize.define(
  'City',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    city_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'cities',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat',
  }
)

module.exports = CityModel
