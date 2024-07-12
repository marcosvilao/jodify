const { PromoterModel, UserModel } = require('../models/associations.js')
const PostgresDBStorage = require('../storage/postgresDBStorage.js')
const { createClerkClient } = require('@clerk/clerk-sdk-node')
const namesTypes = require('../utils/associationsNames.js')
const { filterUpdatedData } = require('../utils/functions.js')
require('dotenv').config()

const storage = new PostgresDBStorage()

const Clerk = new createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

class UserFacade {
  async getUserById(id) {
    try {
      const filter = {}

      filter.where = { id }

      filter.include = [
        {
          model: PromoterModel,
          attributes: ['id', 'name', 'priority', 'instagram'],
          as: namesTypes.Promoter,
        },
      ]

      const user = await storage.find(UserModel, filter)

      if (!user || !user[0]) return null
      return user[0].dataValues
    } catch (error) {
      console.error('Error fetching user by id:', error)
      //   throw error
    }
  }

  async getUserByClerkId(id) {
    try {
      const user = await storage.find(UserModel, { where: { clerk_id: id } })
      if (!user || !user[0]) return null
      return user[0].dataValues
    } catch (error) {
      console.error('Error fetching user by clerk_id:', error)
      //   throw error
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await storage.find(UserModel, { where: { email } })

      if (!user || !user[0]) return null
      return user[0].dataValues
    } catch (error) {
      console.error('Error get user by email', error)
    }
  }

  async getUserByUsername(username) {
    try {
      const user = await storage.find(UserModel, { where: { username } })

      if (!user || !user[0]) return null
      return user[0].dataValues
    } catch (error) {
      console.error('Error get user by username', error)
    }
  }

  async getUserByClerkEmail(email) {
    try {
      const response = await Clerk.users.getUserList({ emailAddress: email })

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
      // console.log('User created in Clerk:', user)
      if (!user || !user._User || !user._User.id) {
        console.log('Clerk no retorno el id')
        return null
      }
      return user
    } catch (error) {
      console.error('Error creating user in Clerk:', error)
    }
  }

  async updateUserInClerk(userId, data) {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null)
      )

      // console.log('filter', filteredData)

      const user = await Clerk.users.updateUser(userId, filteredData)
      // console.log('User updated in Clerk:', user)
      return user
    } catch (error) {
      console.error('Error updating user in Clerk:', error)
      return null
    }
  }

  async deleteUserInClerk(userId) {
    try {
      const response = await Clerk.users.deleteUser(userId)
      console.log('User deleted in Clerk:', response)
      return response
    } catch (error) {
      console.error('Error delete user in Clerk:', error)
      return null
    }
  }

  async createUser(data) {
    try {
      const newUser = await storage.create(UserModel, data)

      if (!newUser) return null

      return newUser
    } catch (error) {
      console.error('Error create user', error)
    }
  }

  async updateUser(id, data) {
    try {
      const filteredData = filterUpdatedData(data)
      const [numberUpdatedRows, [userUpdated]] = await storage.update(UserModel, filteredData, {
        where: { id },
        returning: true,
      })

      if (numberUpdatedRows === 0) return null
      return userUpdated.dataValues
    } catch (error) {
      console.error('Error update user', error)
    }
  }

  async deleteUser(id) {
    try {
      const response = await storage.delete(UserModel, { id })

      return response
    } catch (error) {
      console.error('Error delete user', error)
    }
  }
}

module.exports = UserFacade
