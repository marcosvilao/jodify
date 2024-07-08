const { PromoterFacade } = require('../facade/promoters.facade.js')
const { v4: uuidv4 } = require('uuid')
const PromoterFacade2 = require('../facade/promoters.facade2.js')

const facade = new PromoterFacade()
const facade2 = new PromoterFacade2()

class PromoterHelper {
  async getPromoters() {
    return await facade2.getPromoters()
  }

  async getPromoterById(id) {
    return await facade2.getPromoterById(id)
  }

  async getPromoterByInstagram(instagram) {
    return await facade2.getPromoterByInstagram(instagram)
  }

  async getPromoterByName(name) {
    return await facade2.getPromoterByName(name)
  }

  async createPromoter(data) {
    const newPromoter = await facade2.createPromoter(data)
    return newPromoter
  }

  async updatePromoter(id, data) {
    return await facade2.updatePromoter(id, data)
  }
}

module.exports = {
  PromoterHelper,
}
