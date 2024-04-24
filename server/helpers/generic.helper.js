const { GenericFacade } = require('../facade/generic.facade.js')

const facade = new GenericFacade()

class GenericHelper {
  //----------------- DJS-----------------------

  async getDjs() {
    return await facade.getDjs()
  }

  //----------------CITY--------------------------
  async getCities() {
    return await facade.getCities()
  }

  //---------------TYPES----------------------------

  async getTypes() {
    return await facade.getTypes()
  }
}

module.exports = {
  GenericHelper,
}
