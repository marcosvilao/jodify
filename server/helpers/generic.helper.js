const { GenericFacade } = require("../facade/generic.facade.js");
const GenericFacade2 = require("../facade/generic.facade2.js");
const { v4: uuidv4 } = require("uuid");

const facade = new GenericFacade();
const facade2 = new GenericFacade2();

class GenericHelper {
  //----------------VENUE----------------------

  async getVenueById(id) {
    return await facade2.getVenueById(id);
  }

  async getVenues(city) {
    return await facade2.getVenues(city);
  }

  async getVenueByName(name) {
    return await facade2.getVenueByName(name);
  }

  async createVenue(data) {
    return await facade2.createVenue(data);
  }

  async updateVenue() {}

  async deleteVenue() {}

  //----------------- DJS-----------------------

  async getDjs() {
    return await facade2.getDjs();
  }

  async createDj(name) {
    return await facade2.createDj({ name });
  }

  async getDjByName(name) {
    return await facade2.getDjByName(name);
  }

  //----------------CITY--------------------------
  async getCities() {
    return await facade2.getCities();
  }

  async getCityByName(name) {
    return await facade2.getCityByName(name);
  }

  async getCityByCoords(lat, lng) {
    return await facade2.getCityByCoords(lat, lng);
  }

  async createCity(name, latitude, longitude) {
    const data = { city_name: name, latitude, longitude };

    return await facade2.createCity(data);
  }
  //---------------TYPES----------------------------

  async getTypes() {
    return await facade2.getTypes();
  }
}

module.exports = {
  GenericHelper,
};
