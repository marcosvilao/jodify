const GenericFacade = require('../facade/generic.facade.js')

const facade = new GenericFacade()

class GenericHelper {
  //----------------VENUE----------------------

  async getVenueById(id) {
    return await facade.getVenueById(id)
  }

  async getVenues(city) {
    return await facade.getVenues(city)
  }

  async getVenueByName(name) {
    return await facade.getVenueByName(name)
  }

  async createVenue(data) {
    return await facade.createVenue(data)
  }

  async updateVenue() {}

  async deleteVenue() {}

  //----------------- DJS-----------------------

  async getDjs() {
    return await facade.getDjs()
  }

  async createDj(name) {
    return await facade.createDj({ name })
  }

  async getDjByName(name) {
    return await facade.getDjByName(name)
  }

  //----------------CITY--------------------------
  async getCities() {
    return await facade.getCities()
  }

  async getCityByName(name) {
    return await facade.getCityByName(name)
  }

  async getCityByCoords(lat, lng) {
    return await facade.getCityByCoords(lat, lng)
  }

  async createCity(name, latitude, longitude) {
    const data = { city_name: name, latitude, longitude }

    return await facade.createCity(data)
  }
  //---------------TYPES----------------------------

  async getTypes() {
    return await facade.getTypes()
  }
}

module.exports = {
  GenericHelper,
}
