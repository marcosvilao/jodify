const { PromoterModel } = require('../models/associations.js')
const PostgresDBStorage = require('../storage/postgresDBStorage.js')
const { filterUpdatedData } = require('../utils/functions.js')

const storage = new PostgresDBStorage()

class PromoterFacade {
  async getPromoters() {
    try {
      const filter = {}

      filter.order = [['name', 'asc']]
      const promoters = await storage.find(PromoterModel, filter)

      if (!promoters) return []

      return promoters
    } catch (error) {
      console.error('Error get promoters', error)
    }
  }

  async getPromoterById(id) {
    try {
      const promoter = await storage.findById(PromoterModel, id)

      if (!promoter) return null

      return promoter
    } catch (error) {
      console.error('Error get promoter by id', error)
    }
  }

  async getPromoterByInstagram(instagram) {
    try {
      const promoter = await storage.find(PromoterModel, { where: { instagram } })

      if (!promoter || !promoter[0]) return null

      return promoter[0].dataValues
    } catch (error) {
      console.error('Error get promoter by instagram', error)
    }
  }

  async getPromoterByName(name) {
    try {
      const promoter = await storage.find(PromoterModel, { where: { name } })

      if (!promoter || !promoter[0]) return null

      return promoter[0].dataValues
    } catch (error) {
      console.error('Error get promoters by name', error)
    }
  }

  async createPromoter(data) {
    try {
      const promoter = await storage.create(PromoterModel, data)

      if (!promoter) return null
      return promoter
    } catch (error) {
      console.error('Error create promoter:', error)
    }
  }

  async updatePromoter(id, data) {
    try {
      const filteredData = filterUpdatedData(data)

      const [numberUpdatedRows, [promoterUpdated]] = await storage.update(
        PromoterModel,
        filteredData,
        {
          where: { id },
          returning: true,
        }
      )

      if (numberUpdatedRows === 0) return null

      return promoterUpdated.dataValues
    } catch (error) {
      console.error('Error update promoter', error)
    }
  }
}

module.exports = PromoterFacade
