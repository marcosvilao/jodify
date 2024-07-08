const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const VenueModel = sequelize.define(
  'Venue',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'venue',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat',
  }
)

module.exports = VenueModel
