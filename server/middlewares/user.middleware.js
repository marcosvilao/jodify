const { UserHelper } = require('../helpers/user.helper.js')
const { PromoterHelper } = require('../helpers/promoters.helper.js')
const bcrypt = require('bcryptjs')
const { UUIDV4RegEx } = require('../utils/regex.js')

const helper = new UserHelper()
const helperPromoter = new PromoterHelper()

async function validateUserId(req, res, next) {
  const { id } = req.params

  if (!UUIDV4RegEx.test(id)) {
    const message = `Invalid Id: '${id}'.`
    return res.status(404).send({ message })
  }

  const user = await helper.getUserById(id)

  if (!user) {
    const message = `No existe un usuario con el id: '${id}'`
    return res.status(404).send({ message })
  }

  res.locals.user = user
  next()
}

async function validateDataUserCreate(req, res, next) {
  const { email, password, name, phone, username, instagram, priority } = req.body

  if (!email || !password || !phone || !username) {
    const message = `Para crear un usuario debe agregar email, password, username y phone.`
    return res.status(404).send({ message })
  }

  const user = await helper.getUserByEmail(email)

  if (user) {
    const message = `Ya existe un usuario registrado con el email: '${email}'`
    return res.status(404).send({ message })
  }

  let promoter = null

  if (instagram) {
    promoter = await helperPromoter.getPromoterByInstagram(instagram)

    if (!promoter) {
      if (!priority || !name) {
        const message = 'Para crear una productora debe agregar priority, name e instagram.'
        return res.status(404).send({ message })
      }

      if (typeof priority !== 'number') {
        const message = `priority erróneo: '${priority}'. Priority debe ser un numero entero.`
        return res.status(404).send({ message })
      }

      promoter = await helperPromoter.createPromoter({ instagram, priority, name })

      if (!promoter) {
        const message = 'Error al crear productora.'
        return res.status(404).send({ message })
      }
    }
  }

  res.locals.data = { email, password, phone, username, promoter }
  next()
}

async function validateDataUserAuth0Create(req, res, next) {
  const { email, name, phone, username, instagram, priority } = req.body

  if (!email || !phone || !username) {
    const message = `Para crear un usuario debe agregar email, username y phone.`
    return res.status(404).send({ message })
  }

  const user = await helper.getUserByEmail(email)

  if (user) {
    const message = `Ya existe un usuario registrado con el email: '${email}'`
    return res.status(404).send({ message })
  }

  let promoter = null

  if (instagram) {
    promoter = await helperPromoter.getPromoterByInstagram(instagram)

    if (!promoter) {
      if (!priority || !name) {
        const message = 'Para crear una productora debe agregar priority, name e instagram.'
        return res.status(404).send({ message })
      }

      promoter = await helperPromoter.createPromoter({ instagram, priority, name })

      if (!promoter) {
        const message = 'Error al crear productora.'
        return res.status(404).send({ message })
      }
    }
  }

  res.locals.data = { email, phone, username, promoter }
  next()
}

async function validateDataUpdatePassword(req, res, next) {
  const { newPassword, oldPassword } = req.body
  const { user } = res.locals

  if (!user.password) {
    const message = `El usuario con email: ${user.email} se registro con auth0. No puede cambiar password.`
    return res.status(404).send({ message })
  }

  if (!newPassword || !oldPassword) {
    const message = 'Debe ingresar newPassword y oldPassword.'
    return res.status(404).send({ message })
  }

  const validatePassword = await bcrypt.compare(oldPassword, user.password)

  if (!validatePassword) {
    const message = `La old password ingresada es incorrecta.`
    return res.status(404).send({ message })
  }

  res.locals.newPassword = newPassword
  next()
}

async function validateUserEmail(req, res, next) {
  const { email } = req.body

  if (!email) {
    const message = 'Debe ingresar un email.'
    return res.status(404).send({ message })
  }

  const user = await helper.getUserByEmail(email)

  if (!user) {
    const message = `No hay un usuario registrado con el email: '${email}'.`
    return res.status(404).send({ message })
  }

  res.locals.email = email
  res.locals.user = user
  next()
}

async function validatePassword(req, res, next) {
  const { password } = req.body
  const { user, email } = res.locals

  if (!password) {
    const message = 'Debe ingresar una password.'
    return res.status(404).send({ message })
  }

  if (user.password === null) {
    const message = `El usuario ${user.email} debe iniciar sesión con auth0.`
    return res.status(404).send({ message })
  }

  const validatePass = await bcrypt.compare(password, user.password)

  if (!validatePass) {
    const message = 'Password invalida.'
    return res.status(404).send({ message })
  }

  res.locals.data = { email, password, user }
  next()
}

module.exports = {
  validateUserId,
  validateDataUserCreate,
  validateDataUserAuth0Create,
  validateDataUpdatePassword,
  validateUserEmail,
  validatePassword,
}
