const { Router } = require('express')
const { GenericHelper } = require('../helpers/generic.helper')

const route = Router()
const helper = new GenericHelper()

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
