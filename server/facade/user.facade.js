const pool = require('../db')

class UserFacade {
  async getUserById(id) {
    const query = `SELECT * FROM users WHERE id = $1`
    const user = await pool.query(query, [id])
    if (!user || !user.rows[0]) return null
    return user.rows[0]
  }

  async getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`
    const user = await pool.query(query, [email])

    if (!user || !user.rows[0]) return null
    return user.rows[0]
  }

  async createUser(data) {
    const query = `INSERT INTO users (id, username, password, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *`

    const { id, username, email, password, phone } = data

    const newUser = await pool.query(query, [id, username, password, email, phone])

    if (!newUser || !newUser.rows[0]) return null

    return newUser.rows[0]
  }

  async createUserAuth0(data) {
    const query = `INSERT INTO users (id, username, email, phone) VALUES ($1, $2, $3, $4) RETURNING *`

    const { id, username, email, phone } = data

    const newUser = await pool.query(query, [id, username, email, phone])

    if (!newUser || !newUser.rows[0]) return null

    return newUser.rows[0]
  }

  async updateUser(id, data) {
    const { email, password, username, phone, promoter_id } = data

    const setParts = []

    if (promoter_id) setParts.push(`promoter_id = '${promoter_id}'`)
    if (password) setParts.push(`password = '${password}'`)
    if (username) setParts.push(`username = '${username}'`)
    if (phone) setParts.push(`phone = '${phone}'`)
    if (email) setParts.push(`email = '${email}'`)

    const setClause = setParts.join(', ')

    const query = `UPDATE users SET ${setClause} WHERE id = '${id}' RETURNING *;`

    const userUpdated = await pool.query(query)

    if (!userUpdated || !userUpdated.rows[0]) return null
    return userUpdated.rows[0]
  }
}

module.exports = {
  UserFacade,
}
