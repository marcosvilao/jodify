const { Router } = require('express')
const { PromoterHelper } = require('../helpers/promoters.helper.js')
const { validateCreatePromoterData } = require('../middlewares/promoters.middleware.js')
const { scrapInstagram } = require('../Brain/scrappingPromoterIG.js')
const route = Router()

const helper = new PromoterHelper()

route.get('/', async (req, res) => {
  try {
    const promoters = await helper.getPromoters()

    return res.status(200).send(promoters)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

route.post('/create-promoter', validateCreatePromoterData, async (req, res) => {
  const { data } = res.locals

  try {
    await helper.createPromoter(data)

    return res.status(200).send('productora creada correctamente')
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

route.post('/scrapping-promoter', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(404).send({ response: 'falta ingresar username y password' })
    }

    await scrapInstagram(username, password)

    return res.status(200).send({ message: 'scrapping de Ig finalizado :)' })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

module.exports = route
