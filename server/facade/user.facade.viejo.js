const pool = require('../db')
const { createClerkClient } = require('@clerk/clerk-sdk-node')
require('dotenv').config()

const Clerk = new createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})
console.log(process.env.CLERK_SECRET_KEY)
class UserFacade {
  async getUserById(id) {
    try {
      const query = `
        SELECT u.*, p.name, p.instagram
        FROM users u
        LEFT JOIN promoters p ON u.promoter_id = p.id
        WHERE u.id = $1
      `
      const user = await pool.query(query, [id])
      if (!user || !user.rows[0]) return null
      return user.rows[0]
    } catch (error) {
      console.error('Error fetching user by id:', error)
      throw error
    }
  }

  async getUserByClerkId(id) {
    try {
      const query = `
        SELECT * FROM users WHERE clerk_id = $1
      `
      const user = await pool.query(query, [id])
      if (!user || !user.rows[0]) return null
      return user.rows[0]
    } catch (error) {
      console.error('Error fetching user by clerk_id:', error)
      throw error
    }
  }

  async getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`
    const user = await pool.query(query, [email])

    if (!user || !user.rows[0]) return null
    return user.rows[0]

    //   const query = `
    //   SELECT
    //     u.*,
    //     p.*
    //   FROM
    //     users u
    //   LEFT JOIN
    //     promoters p ON u.promoter_id = p.id
    //   WHERE
    //     u.email = $1
    // `

    //   const result = await pool.query(query, [email])

    //   if (!result || !result.rows[0]) return null

    //   return result.rows[0]
  }

  async getUserByClerkEmail(email) {
    try {
      const response = await Clerk.users.getUserList({ emailAddress: email })

      console.log('res', response)
      if (response.totalCount > 0) {
        return {
          passwordEnabled: response.data[0].passwordEnabled,
          id: response.data[0].id,
        }
      } else {
        return false
      }
    } catch (error) {
      console.error('Error checking email:', error)
    }
  }

  async createUserInClerk(email, password, username) {
    try {
      const user = await Clerk.users.createUser({
        emailAddress: [email],
        password: password,
        username: username,
      })
      console.log('User created in Clerk:', user)
      return user
    } catch (error) {
      console.error('Error creating user in Clerk:', error)
    }
  }

  async createUser(data) {
    const query = `INSERT INTO users (id, username, password, email, phone, clerk_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`

    const { id, username, email, password, phone, clerk_id } = data

    const newUser = await pool.query(query, [id, username, password, email, phone, clerk_id])

    if (!newUser || !newUser.rows[0]) return null

    return newUser.rows[0]
  }

  async createUserAuth0(data) {
    const query = `INSERT INTO users (id, username, email, phone, clerk_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`

    const { id, username, email, phone, clerk_id } = data

    const newUser = await pool.query(query, [id, username, email, phone, clerk_id])

    if (!newUser || !newUser.rows[0]) return null

    return newUser.rows[0]
  }

  async updateUser(id, data) {
    const { password, username, phone, promoter_id, clerk_id } = data

    const setParts = []

    if (promoter_id) setParts.push(`promoter_id = '${promoter_id}'`)
    if (password) setParts.push(`password = '${password}'`)
    if (username) setParts.push(`username = '${username}'`)
    if (phone) setParts.push(`phone = '${phone}'`)
    if (clerk_id) setParts.push(`clerk_id = '${clerk_id}'`)

    setParts.push(`updatedAt = CURRENT_TIMESTAMP`)

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
