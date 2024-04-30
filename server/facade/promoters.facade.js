const pool = require('../db')

class PromoterFacade {
  async getPromoters() {
    const promoters = await pool.query('SELECT * FROM promoters ORDER BY "name" ASC')

    if (!promoters) return []

    return promoters.rows
  }

  async getPromoterByInstagram(instagram) {
    const queryIg = 'SELECT * FROM promoters WHERE instagram = $1'
    const valuesIg = [instagram]

    const promoter = await pool.query(queryIg, valuesIg)

    if (!promoter || !promoter.rows[0]) return null

    return promoter.rows[0]
  }

  async createPromoter(data) {
    const { name, instagram, priority, id } = data

    const queryString = `INSERT INTO promoters (name, instagram, priority, id) VALUES ($1, $2, $3, $4) RETURNING *`
    const values = [name, instagram, priority, id]
    const promoter = await pool.query(queryString, values)

    if (!promoter || !promoter.rows[0]) return null
    return promoter.rows[0]
  }
}

module.exports = {
  PromoterFacade,
}
