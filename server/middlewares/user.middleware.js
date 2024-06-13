const { UserHelper } = require('../helpers/user.helper.js')
const { PromoterHelper } = require('../helpers/promoters.helper.js')
const bcrypt = require('bcryptjs')
const { UUIDV4RegEx } = require('../utils/regex.js')
const jwt = require('jsonwebtoken')

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

async function validateUserTypePromoter(req, res, next) {
  const { promoterLogin } = req.body
  const { user } = res.locals

  if (promoterLogin === undefined) {
    const message = "Debe pasar la propiedad 'promoterLogin' como booleano para iniciar sesión."
    return res.status(404).send({ message })
  }

  if (promoterLogin && !user.promoter_id) {
    const message = `El usuario con email: ${user.email}, no es una productora registrada.`
    return res.status(404).send({ message })
  }

  next()
}

async function validateDataUpdateUser(req, res, next) {
  const { promoter_name, instagram, phone } = req.body
  const { user } = res.locals

  if (!promoter_name && !instagram && !email && !phone) {
    const message =
      'Para actualizar los datos del usuario debe ingresar alguno de los siguientes parámetros:  phone, promoter_name o instagram.'
    return res.status(404).send({ message })
  }

  let promoter = null

  if (instagram || promoter_name) {
    if (!user.promoter_id) {
      const message =
        'Para actualizar promoter_name o instagram, el usuario debe estar asociado a un promoter_id.'
      return res.status(404).send({ message })
    }

    promoter = await helperPromoter.getPromoterById(user.promoter_id)

    if (!promoter) {
      const message = `No se encontró una productora con el id:${user.promoter_id}`
      return res.status(404).send({ message })
    }

    if (instagram !== promoter.instagram) {
      const validateIg = await helperPromoter.getPromoterByInstagram(instagram)

      if (validateIg) {
        const message = `Existe una productora con el instagram: ${instagram}.`
        return res.status(404).send({ message })
      }
    }
  }

  res.locals.data = { promoter, instagram, promoter_name, phone }
  next()
}

async function validateDataForgetPassword(req, res, next) {
  const { token, newPassword } = req.body

  if (!token || !newPassword) {
    const message = 'Debe ingresar el token y newPassword.'
    return res.status(404).send({ message })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
    const userId = decoded.id

    if (!userId) {
      const message = 'No se encontró el id del usuario en el token.'
      return res.status(404).send({ message })
    }

    const user = await helper.getUserById(userId)

    if (!user) {
      const message = 'No se encontró el usuario.'
      return res.status(404).send({ message })
    }

    res.locals.id = userId
    res.locals.data = { password: newPassword }
    next()
  } catch (error) {
    const message = 'Token inválido.'
    return res.status(401).send({ message })
  }
}

async function validateDataValEmail(req, res, next) {
  const { email, username, adminName } = req.body

  if (!email || !username || !adminName) {
    const message = 'Debe ingresar un email, username y adminName.'
    return res.status(404).send({ message })
  }

  const user = await helper.getUserByEmail(email)

  if (user) {
    const message = `Existe un usuario registrado con el email: ${email}.`
    return res.status(404).send({ message })
  }

  res.locals.data = { email, username, adminName }
  next()
}

async function validateDataClerkEmail(req, res, next) {
  const { email } = req.body
  console.log(email)
  if (!email) {
    const message = 'Debe ingresar un email.'
    return res.status(404).send({ message })
  }

  const user = await helper.getUserByClerkEmail(email)

  if (user) {
    const message = `Existe un usuario registrado con el email: ${email}.`
    return res.status(200).send({exist: true, passwordEnabled: user.passwordEnabled, message })
  } else {
    const message = `No existe un usuario registrado con el email: ${email}.`
    return res.status(200).send({exist: false, message })
  }

  res.locals.data = { email }
  next()
}


module.exports = {
  validateUserId,
  validateDataUserCreate,
  validateDataUserAuth0Create,
  validateDataUpdatePassword,
  validateUserEmail,
  validatePassword,
  validateDataUpdateUser,
  validateDataForgetPassword,
  validateDataValEmail,
  validateUserTypePromoter,
  validateDataClerkEmail
}
