const pool = require('../db')

class PromoterFacade {
  async getPromoters() {
    const promoters = await pool.query('SELECT * FROM promoters ORDER BY "name" ASC')

    if (!promoters) return []

    return promoters.rows
  }

  async getPromoterById(id) {
    const query = `SELECT * FROM promoters WHERE id = '${id}'`

    const promoter = await pool.query(query)

    if (!promoter || !promoter.rows[0]) return null

    return promoter.rows[0]
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

  async updatePromoter(id, data) {
    const { name, instagram, priority } = data
    const setParts = []

    if (name) setParts.push(`name = '${name}'`)
    if (instagram) setParts.push(`instagram = '${instagram}'`)
    if (priority) setParts.push(`priority = '${priority}'`)

    setParts.push(`updatedAt = CURRENT_TIMESTAMP`)

    const setClause = setParts.join(', ')

    const query = `UPDATE promoters SET ${setClause} WHERE id = '${id}' RETURNING *;`

    const promoterUpdated = await pool.query(query)

    if (!promoterUpdated || !promoterUpdated.rows[0]) return null

    return promoterUpdated.rows[0]
  }
}

module.exports = {
  PromoterFacade,
}
