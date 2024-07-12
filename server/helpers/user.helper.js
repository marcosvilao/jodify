const bcrypt = require('bcryptjs')
const { sanitizeUsername } = require('../utils/functions.js')
const {
  mailOptionGeneratePassword,
  sendEmail,
  mailOptionValidateEmail,
  mailOptionWelcomeForm,
  mailOptionUserPromoterRegister,
  mailOptionUpdatePassApp,
} = require('../utils/nodeMailer/functions.js')
const jwt = require('jsonwebtoken')
const UserFacade = require('../facade/user.facade.js')
const PromoterFacade = require('../facade/promoters.facade.js')

const facadePromoter = new PromoterFacade()
const facade = new UserFacade()

class UserHelper {
  async getUserById(id) {
    return await facade.getUserById(id)
  }

  async getUserByClerkId(id) {
    return await facade.getUserByClerkId(id)
  }

  async getUserByEmail(email) {
    return await facade.getUserByEmail(email)
  }

  async getUserByUsername(username) {
    return await facade.getUserByUsername(username)
  }

  async getUserByClerkEmail(email) {
    return await facade.getUserByClerkEmail(email)
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
    return facade.createUserInClerk(email, password, username)
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

    let newUser = await facade.createUser(userData)

    if (promoter) {
      newUser = await facade.updateUser(newUser.id, {
        promoter_id: promoter.id,
      })
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

    let newUser = await facade.createUser(userData)

    if (promoter) {
      newUser = await facade.updateUser(newUser.id, {
        promoter_id: promoter.id,
      })
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
      userUpdatedInClerk = await facade.updateUserInClerk(clerk_id, {
        password: originPass,
        firstName: username,
        primaryEmailAddress: { emailAddress: email },
      })
    }

    if (clerk_id && !userUpdatedInClerk) return null

    if (promoter) {
      const promoterData = { name: promoter_name, instagram }
      promoter = await facadePromoter.updatePromoter(promoter.id, promoterData)
    }

    const userUpdated = await facade.updateUser(id, { ...data })

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

  async deleteUser(user) {
    if (user.clerk_id) {
      const response = await facade.deleteUserInClerk(user.clerk_id)
    }

    return await facade.deleteUser(user.id)
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
