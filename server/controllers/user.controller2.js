const { Router } = require('express')
const { UserHelper } = require('../helpers/user.helper.js')
const {
  validateDataUserCreate,
  validateDataUserAuth0Create,
  validateUserId,
  validateDataUpdatePassword,
  validatePassword,
  validateUserEmail,
  validateDataUpdateUser,
  validateDataForgetPassword,
  validateDataValEmail,
  validateUserTypePromoter,
} = require('../middlewares/user.middleware.js')

const route = Router()
const helper = new UserHelper()

route.get('/:id', validateUserId, async (req, res) => {
  try {
    const { user } = res.locals

    res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.post('/create', validateDataUserCreate, async (req, res) => {
  try {
    const { data } = res.locals

    const user = await helper.createUser(data)

    res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.post('/create-auth0', validateDataUserAuth0Create, async (req, res) => {
  try {
    const { data } = res.locals

    const user = await helper.createUserAuth0(data)

    res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.put('/update-password/:id', validateUserId, validateDataUpdatePassword, async (req, res) => {
  try {
    const { user, newPassword } = res.locals

    const userUpdated = await helper.updateUser(user.id, { newPassword })

    res.status(200).send({ message: 'Password actualizada con éxito.' })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.put('/update/:id', validateUserId, validateDataUpdateUser, async (req, res) => {
  try {
    const { user, data } = res.locals

    const userUpdated = await helper.updateUser(user.id, data)

    res.status(200).send({ message: 'Usuario actualizado con éxito.', user: userUpdated })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.post(
  '/login',
  validateUserEmail,
  validateUserTypePromoter,
  validatePassword,
  async (req, res) => {
    try {
      const { user } = res.locals

      const response = await helper.logIn(user)

      return res.status(200).send({ user: response })
    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  }
)

route.post('/login-auth0', validateUserEmail, validateUserTypePromoter, async (req, res) => {
  try {
    const { user } = res.locals

    const response = await helper.logIn(user)

    return res.status(200).send({ user: response })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.patch('/forget-password', validateUserEmail, async (req, res) => {
  try {
    const { user } = res.locals

    const token = await helper.forgetPassword(user)

    res.status(200).send({ message: 'Email para generar una nueva contraseña enviado con éxito.' })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.patch('/new-password', validateDataForgetPassword, async (req, res) => {
  try {
    const { id, data } = res.locals

    const muestraDePrueba = await helper.updateUser(id, data)

    res.status(200).send({ message: 'Contraseña actualizada con éxito.' })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.post('/validate-email', validateDataValEmail, async (req, res) => {
  try {
    const { data } = res.locals

    await helper.generateToken(data.email, data.username, data.adminName, 'validateEmail')

    res.status(200).send({ message: `Email enviado con éxito a ${data.email}` })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.post('/welcome-form', validateDataValEmail, async (req, res) => {
  try {
    const { data } = res.locals

    await helper.generateToken(data.email, data.username, data.adminName)

    res.status(200).send({ message: `Email enviado con éxito a ${data.email}` })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/*
get userById, <----
createUser auth0, <------
login user, <----
cambiar pass, <.......
olvide pass, <---
validar email, 
login user auth0 <---

*/

module.exports = route
