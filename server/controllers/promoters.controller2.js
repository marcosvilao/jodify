const { Router } = require('express')
const { PromoterHelper } = require('../helpers/promoters.helper.js')
const { validateCreatePromoterData } = require('../middlewares/promoters.middleware.js')
const { scrapInstagram } = require('../Brain/getEventData.js')
const { scrapPromoterData } = require('../utils/scrapping/scrapPromoterIgData.js')
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

route.get('/scrap-promoter', async (req, res) => {
  try {
    // await scrapInstagram()
    await scrapPromoterData()

    return res.status(200).send({ message: 'scrap de Ig finalizado :)' })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

module.exports = route
