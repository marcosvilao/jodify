const { UserFacade } = require('../facade/user.facade.js')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const { generateCode } = require('../utils/functions.js')
const {
  mailOptionGeneratePassword,
  sendEmail,
  mailOptionValidateEmail,
  mailOptionWelcomeForm,
} = require('../utils/nodeMailer/functions.js')
const { PromoterFacade } = require('../facade/promoters.facade.js')
const jwt = require('jsonwebtoken')

const facade = new UserFacade()
const facadePromoter = new PromoterFacade()

class UserHelper {
  async getUserById(id) {
    return await facade.getUserById(id)
  }

  async getUserByEmail(email) {
    return await facade.getUserByEmail(email)
  }

  async createUser(data) {
    const { email, password, phone, username, promoter } = data
    const id = uuidv4()
    const passHashed = await bcrypt.hash(password, 10)

    data.password = passHashed

    const userData = {
      id,
      email,
      password: passHashed,
      phone,
      username,
    }

    let newUser = await facade.createUser(userData)

    // TODO enviar email para validar email?

    if (promoter) {
      newUser = await facade.updateUser(newUser.id, { promoter_id: promoter.id })
    }

    return newUser
  }

  async createUserAuth0(data) {
    const { promoter, ...userData } = data

    const id = uuidv4()
    userData.id = id

    let newUser = await facade.createUserAuth0(userData)

    if (promoter) {
      newUser = await facade.updateUser(newUser.id, { promoter_id: promoter.id })
    }

    return newUser
  }

  async updateUser(id, data) {
    let { email, password, username, phone, promoter, promoter_name, instagram } = data

    if (password) {
      const passHashed = await bcrypt.hash(password, 10)

      data.password = passHashed
    }

    if (promoter) {
      const promoterData = { name: promoter_name, instagram }
      await facadePromoter.updatePromoter(promoter.id, promoterData)
    }

    const userUpdated = await facade.updateUser(id, data)

    if (!userUpdated) return null

    if (email) {
      const emailMessage = mailOptionValidateEmail(userUpdated.email, userUpdated.username)

      await sendEmail(emailMessage)
    }
    return userUpdated
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
      emailMessage = mailOptionValidateEmail(email, username, adminName, token)
    } else {
      emailMessage = mailOptionWelcomeForm(email, username, adminName, token)
    }

    await sendEmail(emailMessage)
    return
  }
}

module.exports = {
  UserHelper,
}
