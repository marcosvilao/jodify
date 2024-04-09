const pool = require('../db')

class GenericFacade {
  //----------------- DJS-----------------------

  async getDjs() {
    const query = `
    SELECT d.id, d.name, json_agg(t.*) as types
    FROM djs d
    LEFT JOIN dj_types dt ON d.id = dt.dj_id
    LEFT JOIN types t ON dt.type_id = t.id
    GROUP BY d.id
    ORDER BY d.name ASC
    `

    const djsWithTypes = await pool.query(query)

    if (!djsWithTypes) return []
    return djsWithTypes.rows
  }

  //----------------CITY--------------------------

  async getCities() {
    const cities = await pool.query('SELECT * FROM cities ORDER BY city_name ASC')
    if (!cities) return []

    return cities.rows
  }
  //---------------TYPES----------------------------

  async getTypes() {
    const types = await pool.query('SELECT * FROM types ORDER BY "name" ASC')

    if (!types) return []

    return types.rows
  }
}

module.exports = {
  GenericFacade,
}
