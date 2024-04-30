const { UserFacade } = require('../facade/user.facade.js')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const { generateCode } = require('../utils/functions.js')
const { mailOptionGeneratePassword, sendEmail } = require('../utils/nodeMailer/functions.js')

const facade = new UserFacade()

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
    let { email, newPassword, username, phone } = data

    if (newPassword) {
      const passHashed = await bcrypt.hash(newPassword, 10)

      data.newPassword = passHashed
    }

    return await facade.updateUser(id, data)
  }

  async generateNewPassword(user) {
    const newPass = generateCode()

    const passHashed = await bcrypt.hash(newPass, 10)

    const userUpdated = await facade.updateUser(user.id, {
      password: passHashed,
    })

    // const emailMessage = mailOptionGeneratePassword(user.email, user.username, newPass)

    // await sendEmail(emailMessage)

    return newPass
  }
}

module.exports = {
  UserHelper,
}
