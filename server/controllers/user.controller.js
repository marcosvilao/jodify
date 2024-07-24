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
  validateAppEmail,
  validateAppLoginData,
  validateDataUpdateUserApp,
  validateUserDelete,
} = require('../middlewares/user.middleware.js')

const route = Router()
const helper = new UserHelper()

route.get('/clerk-id/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await helper.getUserByClerkId(id)

    return res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query

    const user = await helper.getUserByUsername(String(username))

    if (!user)
      return res
        .status(200)
        .send({ message: `No existe un usuario con el username: ${String(username)}` })

    return res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.post('/send-email-update-pass', validateUserEmail, async (req, res) => {
  try {
    const { user } = res.locals

    await helper.sendEmailUpdatePasswordInApp(user)

    return res.status(200).send({ message: 'Email enviado exitosamente.' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error.message })
  }
})

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

    const userUpdated = await helper.updateUser(user.id, { password: newPassword })

    res.status(200).send({ message: 'Password actualizada con éxito.' })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.put('/update/:id', validateUserId, validateDataUpdateUser, async (req, res) => {
  try {
    const { user, data } = res.locals

    const userUpdated = await helper.updateUser(user.id, data)

    if (!userUpdated)
      return res.status(404).send({ message: 'Error al actualizar datos del usuario.' })

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

//---------------------------APP-----------------------------

route.post('/login-app', validateAppLoginData, async (req, res) => {
  try {
    const { user } = res.locals

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.post('/check-email', validateAppEmail, async (req, res) => {
  try {
    const { email } = res.locals

    res
      .status(200)
      .json({ exist: false, message: `Valido para registrarse con el correo ${email}` })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.put('/update-app/:id', validateUserId, validateDataUpdateUserApp, async (req, res) => {
  try {
    const { user, data } = res.locals

    const userUpdated = await helper.updateUser(user.id, data)

    if (!userUpdated) return res.status(404).send({ message: 'Error al editar usuario' })

    res.status(200).send({ user: userUpdated })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

route.delete('/:id', validateUserId, validateUserDelete, async (req, res) => {
  try {
    const { user } = res.locals

    const response = await helper.deleteUser(user)

    res.status(200).send({ message: `Usuario ${user.email} eliminado exitosamente :(`, response })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

module.exports = route
