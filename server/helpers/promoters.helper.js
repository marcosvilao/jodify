const PromoterFacade = require('../facade/promoters.facade.js')

const facade = new PromoterFacade()

class PromoterHelper {
  async getPromoters() {
    return await facade.getPromoters()
  }

  async getPromoterById(id) {
    return await facade.getPromoterById(id)
  }

  async getPromoterByInstagram(instagram) {
    return await facade.getPromoterByInstagram(instagram)
  }

  async getPromoterByName(name) {
    return await facade.getPromoterByName(name)
  }

  async createPromoter(data) {
    const newPromoter = await facade.createPromoter(data)
    return newPromoter
  }

  async updatePromoter(id, data) {
    return await facade.updatePromoter(id, data)
  }
}

module.exports = {
  PromoterHelper,
}
