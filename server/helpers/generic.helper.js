const { GenericFacade } = require('../facade/generic.facade.js')
const { v4: uuidv4 } = require('uuid')

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
    data.id = uuidv4()
    return await facade.createVenue(data)
  }

  async updateVenue() {}

  async deleteVenue() {}

  //----------------- DJS-----------------------

  async getDjs() {
    return await facade.getDjs()
  }

  async createDj(name) {
    const id = uuidv4()

    return await facade.createDj(id, name)
  }

  //----------------CITY--------------------------
  async getCities() {
    return await facade.getCities()
  }

  async getCityByName(name) {
    return await facade.getCityByName(name)
  }

  async createCity(name) {
    const id = uuidv4()

    return await facade.createCity(id, name)
  }
  //---------------TYPES----------------------------

  async getTypes() {
    return await facade.getTypes()
  }
}

module.exports = {
  GenericHelper,
}
