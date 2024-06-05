const { Router } = require('express')
const { GenericHelper } = require('../helpers/generic.helper')
const { validateVenueId, validateDataCreateVenue } = require('../middlewares/generic.middleware')

const route = Router()
const helper = new GenericHelper()
//------------------VENUE----------------------

route.get('/all-venues', async (req, res) => {
  try {
    const { city } = req.query

    const venues = await helper.getVenues(city)

    return res.status(200).send({ venues })
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})

route.get('/venue/:id', validateVenueId, async (req, res) => {
  try {
    const { venue } = res.locals

    return res.status(200).send({ venue })
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})
route.post('/create-venue', validateDataCreateVenue, async (req, res) => {
  try {
    const { data } = res.locals

    const venue = await helper.createVenue(data)

    return res.status(200).send({ venue })
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
})
route.put('/update-venue', async (req, res) => {})
route.delete('/delete-venue', async (req, res) => {})

//----------------- DJS-----------------------
route.get('/djs', async (req, res) => {
  try {
    const djs = await helper.getDjs()

    return res.status(200).send(djs)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

//----------------CITY--------------------------
route.get('/city', async (req, res) => {
  try {
    const cities = await helper.getCities()

    return res.status(200).send(cities)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

//---------------TYPES----------------------------

route.get('/types', async (req, res) => {
  try {
    const types = await helper.getTypes()

    return res.status(200).send(types)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

module.exports = route
