const pool = require('../db')

class PromoterFacade {
  async getPromoters() {
    const promoters = await pool.query('SELECT * FROM promoters ORDER BY "name" ASC')

    if (!promoters) return []

    return promoters.rows
  }

  async getPromoterByInstagram(instagram) {
    const queryIg = 'SELECT instagram FROM promoters WHERE instagram = $1'
    const valuesIg = [instagram]

    const promoter = await pool.query(queryIg, valuesIg)

    if (!promoter) return []

    return promoter.rows
  }

  async createPromoter(data) {
    const { name, instagram, priority, id } = data

    const queryString = `INSERT INTO promoters (name, instagram, priority, id) VALUES ($1, $2, $3, $4)`
    const values = [name, instagram, priority, id]
    await pool.query(queryString, values)
  }
}

module.exports = {
  PromoterFacade,
}
