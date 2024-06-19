const { PromoterHelper } = require('../helpers/promoters.helper.js')

const helper = new PromoterHelper()

async function validateCreatePromoterData(req, res, next) {
  let { name, instagram, priority } = req.body

  if (!name || !instagram || !priority) {
    const message = 'Para crear un productor debe ingresar name, instagram and priority.'
    return res.status(404).send({ message })
  }

  if (typeof instagram === 'string' && instagram[0] === '@') {
    instagram = instagram.slice(1)
  }

  const promoterExist = await helper.getPromoterByInstagram(instagram)

  if (promoterExist) {
    const message = `Ya existe un productor con el instagram: ${instagram}`
    return res.status(404).send({ message })
  }

  res.locals.data = { name, instagram, priority }

  next()
}

module.exports = {
  validateCreatePromoterData,
}
