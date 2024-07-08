const { UserFacade } = require('../facade/user.facade.js')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const { generateCode, sanitizeUsername } = require('../utils/functions.js')
const {
  mailOptionGeneratePassword,
  sendEmail,
  mailOptionValidateEmail,
  mailOptionWelcomeForm,
  mailOptionUserPromoterRegister,
  mailOptionUpdatePassApp,
} = require('../utils/nodeMailer/functions.js')
const { PromoterFacade } = require('../facade/promoters.facade.js')
const jwt = require('jsonwebtoken')
const UserFacade2 = require('../facade/user.facade2.js')
const PromoterFacade2 = require('../facade/promoters.facade2.js')

const facade = new UserFacade()
const facadePromoter = new PromoterFacade2()
const facade2 = new UserFacade2()

class UserHelper {
  async getUserById(id) {
    return await facade2.getUserById(id)
  }

  async getUserByClerkId(id) {
    return await facade2.getUserByClerkId(id)
  }

  async getUserByEmail(email) {
    return await facade2.getUserByEmail(email)
  }

  async getUserByUsername(username) {
    return await facade2.getUserByUsername(username)
  }

  async getUserByClerkEmail(email) {
    return await facade2.getUserByClerkEmail(email)
  }

  async logIn(user) {
    if (!user || !user.promoter_id) return user

    const promoter = await facadePromoter.getPromoterById(user.promoter_id)

    const { promoter_id, password, ...dataUser } = user

    const response = {
      ...dataUser,
      promoter: promoter,
    }

    return response
  }

  async createUserInClerk(email, password, username) {
    return facade2.createUserInClerk(email, password, username)
  }

  async createUser(data) {
    const { email, password, phone, username, promoter, clerk_id } = data

    const passHashed = await bcrypt.hash(password, 10)

    data.password = passHashed

    const userData = {
      email: email.toLowerCase(),
      password: passHashed,
      phone,
      username: sanitizeUsername(username),
      clerk_id,
    }

    let newUser = await facade2.createUser(userData)

    if (promoter) {
      newUser = await facade2.updateUser(newUser.id, { promoter_id: promoter.id })
    }

    if (newUser && promoter) {
      const { password, promoter_id, ...dataUser } = newUser

      const emailMessage = mailOptionUserPromoterRegister(newUser.email, newUser.username)

      await sendEmail(emailMessage)

      return {
        ...dataUser,
        promoter,
      }
    }

    return newUser
  }

  async createUserAuth0(data) {
    const { promoter, ...userData } = data

    userData.email = userData.email.toLowerCase()

    userData.username = sanitizeUsername(userData.username)

    let newUser = await facade2.createUser(userData)

    if (promoter) {
      newUser = await facade2.updateUser(newUser.id, { promoter_id: promoter.id })
    }

    return newUser
  }

  async updateUser(id, data) {
    let { username, phone, promoter, promoter_name, instagram, email, password, clerk_id } = data

    const originPass = password
    if (password) {
      const passHashed = await bcrypt.hash(data.password, 10)

      data.password = passHashed
    }

    let userUpdatedInClerk = null

    if (clerk_id) {
      userUpdatedInClerk = await facade2.updateUserInClerk(clerk_id, {
        password: originPass,
        username,
        email,
      })
    }

    if (clerk_id && !userUpdatedInClerk) return null

    if (promoter) {
      const promoterData = { name: promoter_name, instagram }
      promoter = await facadePromoter.updatePromoter(promoter.id, promoterData)
    }

    const userUpdated = await facade2.updateUser(id, { ...data })

    if (!userUpdated) return null

    if (!userUpdated.promoter_id) {
      return userUpdated
    }

    let { promoter_id, ...dataUser } = userUpdated

    if (!promoter && userUpdated.promoter_id) {
      promoter = await facadePromoter.getPromoterById(userUpdated.promoter_id)
    }

    const response = {
      ...dataUser,
      promoter,
    }

    return response
  }

  async forgetPassword(user) {
    const token = jwt.sign({ email: user.email, id: user.id }, process.env.SECRET_KEY_JWT, {
      expiresIn: 15 * 60,
    })

    const emailMessage = mailOptionGeneratePassword(user.email, user.username, token)

    await sendEmail(emailMessage)

    return token
  }

  async generateToken(email, username, adminName, type) {
    const token = jwt.sign({ email }, process.env.SECRET_KEY_JWT, {
      expiresIn: 48 * 60 * 60, // horas * minutos * segundos
    })

    let emailMessage = ''

    if (type === 'validateEmail') {
      emailMessage = mailOptionValidateEmail(email, username, token)
    } else {
      emailMessage = mailOptionWelcomeForm(email, username, adminName, token)
    }

    await sendEmail(emailMessage)
    return
  }

  async sendEmailUpdatePasswordInApp(user) {
    const emailMessage = mailOptionUpdatePassApp(user.email, user.username)
    await sendEmail(emailMessage)
    return
  }
}

module.exports = {
  UserHelper,
}
