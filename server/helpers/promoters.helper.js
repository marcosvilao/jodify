const { PromoterFacade } = require('../facade/promoters.facade.js')
const { v4: uuidv4 } = require('uuid')

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

  async createPromoter(data) {
    const id = uuidv4()

    data.id = id

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
