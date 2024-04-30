const { Router } = require('express')
const { UserHelper } = require('../helpers/user.helper.js')
const {
  validateDataUserCreate,
  validateDataUserAuth0Create,
  validateUserId,
  validateDataUpdatePassword,
  validatePassword,
  validateUserEmail,
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

route.post('/login', validateUserEmail, validatePassword, async (req, res) => {
  try {
    const { user } = res.locals

    return res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.post('/login-auth0', validateUserEmail, async (req, res) => {
  try {
    const { user } = res.locals

    return res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.patch('/generate-password', validateUserEmail, async (req, res) => {
  try {
    const { user } = res.locals

    const muestraDePrueba = await helper.generateNewPassword(user)

    res.status(200).send({ message: 'Nueva contraseña generada con éxito.', muestraDePrueba })
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
