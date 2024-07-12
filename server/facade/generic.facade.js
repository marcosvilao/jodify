const { Op } = require('sequelize')
const { CityModel, TypeModel, DjModel, VenueModel } = require('../models/associations')
const PostgresDBStorage = require('../storage/postgresDBStorage')
const namesTypes = require('../utils/associationsNames')

const storage = new PostgresDBStorage()

class GenericFacade {
  //------------------VENUE-----------------------
  async getVenueById(id, verbose) {
    try {
      const filter = {}

      if (verbose) {
        filter.include = [
          {
            model: CityModel,
            attributes: ['id', 'city_name', 'latitude', 'longitude', 'country'],
            as: namesTypes.City,
          },
        ]
      }

      const venue = await storage.findById(VenueModel, id, filter)

      if (!venue || !venue) return null
      return venue
    } catch (error) {
      console.error('error al buscar venue por id.', error)
    }
  }

  async getVenues(city) {
    try {
      const filter = {}

      filter.include = [
        {
          model: CityModel,
          attributes: ['id', 'city_name', 'latitude', 'longitude', 'country'],
          as: namesTypes.City,
        },
      ]

      if (city) {
        filter.include[0].where = { city_name: city }
      }

      const venues = await storage.find(VenueModel, filter)

      if (!venues) return []

      return venues
    } catch (error) {
      console.error('Error getVenues facade.', error)
    }
  }

  async getVenueByName(name) {
    try {
      const filter = {}

      filter.where = { name }

      const venue = await storage.find(VenueModel, filter)

      if (!venue || !venue[0]) return null

      return venue[0].dataValues
    } catch (error) {
      console.error('error al buscar venue por name. Error:', error)
    }
  }

  async createVenue(data) {
    try {
      const newVenue = await storage.create(VenueModel, data)

      if (!newVenue || !newVenue) return null

      return newVenue
    } catch (error) {
      console.error('Error crear venue. Error:', error)
    }
  }

  async updateVenue() {}

  async deleteVenue() {}

  //----------------- DJS-----------------------

  async getDjs() {
    try {
      const filter = {}

      filter.include = [
        {
          model: TypeModel,
          through: { attributes: [] },
          attributes: ['id', 'name'],
          as: namesTypes.Type,
        },
      ]

      filter.order = [['name', 'asc']]

      const djsWithTypes = await storage.find(DjModel, filter)

      if (!djsWithTypes) return []
      return djsWithTypes
    } catch (error) {
      console.error('Error get djs. Error:', error)
    }
  }

  async getDjByName(name) {
    try {
      const filter = {}

      filter.where = { name }

      const dj = await storage.findOne(DjModel, filter)

      if (!dj) return null
      return dj
    } catch (error) {
      console.error('Error get dj by name. Error:', error)
    }
  }

  async createDj(data) {
    try {
      const newDj = await storage.create(DjModel, data)

      if (!newDj || !newDj) return null

      return newDj
    } catch (error) {
      console.error('Error crear dj. Error:', error)
    }
  }

  //----------------CITY--------------------------

  async getCities() {
    try {
      const filter = {}

      filter.order = [['city_name', 'asc']]

      const cities = await storage.find(CityModel, filter)

      if (!cities || !cities[0]) return []

      return cities
    } catch (error) {
      console.error('error al buscar cities. Error:', error)
    }
  }

  async getCityByName(name) {
    try {
      const filter = {}

      filter.where = { city_name: name }

      const city = await storage.find(CityModel, filter)

      if (!city || !city[0]) return null

      return city[0].dataValues
    } catch (error) {
      console.error('error al buscar city por name. Error:', error)
    }
  }

  async getCityByCoords(lat, lng) {
    try {
      const filter = {}
      const tolerance = 0.01

      filter.where = {
        latitude: {
          [Op.between]: [lat - tolerance, lat + tolerance],
        },
        longitude: {
          [Op.between]: [lng - tolerance, lng + tolerance],
        },
      }

      const city = await storage.find(CityModel, filter)

      if (!city || !city[0]) return null

      return city[0].dataValues
    } catch (error) {
      console.error('Error al buscar city por coords. Error:', error)
      return null
    }
  }

  async createCity(data) {
    try {
      const newCity = await storage.create(CityModel, data)

      if (!newCity) return null

      return newCity
    } catch (error) {
      console.error('Error crear city. Error:', error)
    }
  }
  //---------------TYPES----------------------------

  async getTypes() {
    const filter = {}

    filter.order = [['name', 'asc']]
    const types = await storage.find(TypeModel, filter)

    if (!types) return []

    return types
  }
}

module.exports = GenericFacade
