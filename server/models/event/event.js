const { DataTypes } = require('sequelize')
const sequelize = require('../../db')

const EventModel = sequelize.define(
  'Event',
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
    date_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticket_link: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    date_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    interactions: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'events',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat',
  }
)

module.exports = EventModel
