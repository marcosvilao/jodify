const pool = require('../db')

class GenericFacade {
  //------------------VENUE-----------------------
  async getVenueById(id) {
    try {
      const query = `SELECT * FROM venue WHERE id= $1;`

      const venue = await pool.query(query, [id])

      if (!venue || !venue.rows[0]) return null
      return venue.rows[0]
    } catch (error) {
      console.error('error al buscar venue por id.', error)
    }
  }

  async getVenues(city) {
    try {
      let query = `
        SELECT venue.*, cities.city_name 
        FROM venue
        JOIN cities ON venue.city_id = cities.id
      `

      const queryParams = []

      if (city) {
        query += ` WHERE cities.city_name = $1`
        queryParams.push(city)
      }

      const venues = await pool.query(query, queryParams)

      if (!venues) return []

      return venues.rows
    } catch (error) {
      console.error('Error getVenues facade.', error)
    }
  }

  async getVenueByName(name) {
    try {
      const query = `SELECT * FROM venue WHERE name = $1;`

      const venue = await pool.query(query, [name])

      if (!venue || !venue.rows[0]) return null

      return venue.rows[0]
    } catch (error) {
      console.error('error al buscar venue por name. Error:', error)
    }
  }

  async createVenue(data) {
    try {
      const { id, name, city_id, neighborhood, address, coordinates, province } = data
      const query = `
          INSERT INTO venue(id, name, city_id, neighborhood, address, coordinates, province)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `

      const newVenue = await pool.query(query, [
        id,
        name,
        city_id,
        neighborhood,
        address,
        coordinates,
        province,
      ])

      if (!newVenue || !newVenue.rows[0]) return null

      return newVenue.rows[0]
    } catch (error) {
      console.error('Error crear venue. Error:', error)
    }
  }

  async updateVenue() {}

  async deleteVenue() {}

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

  async createDj(id, name) {
    try {
      const query = `
          INSERT INTO djs(id, name)
          VALUES($1, $2)
          RETURNING *;
        `

      const newDj = await pool.query(query, [id, name])

      if (!newDj || !newDj.rows[0]) return null

      return newDj.rows[0]
    } catch (error) {
      console.error('Error crear dj. Error:', error)
    }
  }

  //----------------CITY--------------------------

  async getCities() {
    const cities = await pool.query('SELECT * FROM cities ORDER BY city_name ASC')
    if (!cities) return []

    return cities.rows
  }

  async getCityByName(name) {
    try {
      const query = `SELECT * FROM cities WHERE city_name = $1;`

      const city = await pool.query(query, [name])

      if (!city || !city.rows[0]) return null

      return city.rows[0]
    } catch (error) {
      console.error('error al buscar city por name. Error:', error)
    }
  }

  async getCityByCoords(lat, lng) {
    try {
      const tolerance = 0.01
      const query = `
        SELECT * 
        FROM cities 
        WHERE 
          ABS(latitude - $1) < $3 
          AND ABS(longitude - $2) < $3;
      `

      const city = await pool.query(query, [lat, lng, tolerance])

      if (!city || !city.rows[0]) return null

      return city.rows[0]
    } catch (error) {
      console.error('Error al buscar city por coords. Error:', error)
      return null
    }
  }

  async createCity(id, name, latitude, longitude) {
    try {
      const query = `
          INSERT INTO cities(id, city_name, latitude, longitude)
          VALUES($1, $2, $3, $4)
          RETURNING *;
        `

      const newCity = await pool.query(query, [id, name, latitude, longitude])

      if (!newCity) return null

      return newCity.rows[0]
    } catch (error) {
      console.error('Error crear city. Error:', error)
    }
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
