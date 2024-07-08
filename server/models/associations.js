const sequelize = require('../db')
const EventModel = require('./event/event')
const DjModel = require('./dj/dj')
const TypeModel = require('./type/type')
const PromoterModel = require('./promoter/promoter')
const CityModel = require('./location/city')
const VenueModel = require('./location/venue')
const UserModel = require('./user/user')
const namesTypes = require('../utils/associationsNames')

const DJType = sequelize.define('dj_types', {}, { timestamps: false })
const EventDJ = sequelize.define('event_djs', {}, { timestamps: false })
const EventPromoter = sequelize.define('event_promoters', {}, { timestamps: false })
const EventType = sequelize.define('event_types', {}, { timestamps: false })

DjModel.belongsToMany(TypeModel, { through: DJType, foreignKey: 'dj_id', as: namesTypes.Type })
TypeModel.belongsToMany(DjModel, { through: DJType, foreignKey: 'type_id', as: namesTypes.Dj })

EventModel.belongsToMany(DjModel, { through: EventDJ, foreignKey: 'event_id', as: namesTypes.Dj })
DjModel.belongsToMany(EventModel, { through: EventDJ, foreignKey: 'dj_id', as: namesTypes.Event })

EventModel.belongsToMany(PromoterModel, {
  through: EventPromoter,
  foreignKey: 'event_id',
  as: namesTypes.Promoter,
})
PromoterModel.belongsToMany(EventModel, {
  through: EventPromoter,
  foreignKey: 'promoter_id',
  as: namesTypes.Event,
})

EventModel.belongsToMany(TypeModel, {
  through: EventType,
  foreignKey: 'event_id',
  as: namesTypes.Type,
})
TypeModel.belongsToMany(EventModel, {
  through: EventType,
  foreignKey: 'type_id',
  as: namesTypes.Event,
})

VenueModel.belongsTo(CityModel, {
  foreignKey: 'city_id',
  onDelete: 'SET NULL',
  as: namesTypes.City,
})
CityModel.hasMany(VenueModel, { foreignKey: 'city_id', as: namesTypes.Venue })

CityModel.hasMany(EventModel, { foreignKey: 'city_id', as: namesTypes.Event })
EventModel.belongsTo(CityModel, {
  foreignKey: 'city_id',
  onDelete: 'SET NULL',
  as: namesTypes.City,
})

UserModel.belongsTo(PromoterModel, { foreignKey: 'promoter_id', as: namesTypes.Promoter })
PromoterModel.hasMany(UserModel, { foreignKey: 'promoter_id', as: namesTypes.User })

module.exports = {
  UserModel,
  VenueModel,
  EventModel,
  DjModel,
  TypeModel,
  PromoterModel,
  CityModel,
  sequelize,
}
