const { GenericHelper } = require('../helpers/generic.helper.js')
const { UUIDV4RegEx } = require('../utils/regex.js')

const helper = new GenericHelper()

//-----------------VENUE-------------------------
async function validateVenueId(req, res, next) {
  const { id } = req.params

  if (id && !UUIDV4RegEx.test(id)) {
    const message = `El id: ${id} no es un UUIDv4 valido.`
    return res.status(404).send({ message })
  }

  const venue = await helper.getVenueById(id)

  if (!venue) {
    const message = `No se encontró venue con el id: ${id}.`
    return res.status(404).send({ message })
  }

  res.locals.venue = venue
  res.locals.id = id
  next()
}

async function validateDataCreateVenue(req, res, next) {
  const { name, address, location, city, latitude, longitude } = req.body
  console.log('body:', req.body)

  if (!name || !address || !location || !city || !latitude || !longitude) {
    const message =
      'Para crear un venue debe agregar name, address, location, city, latitude y longitude.'
    return res.status(404).send({ message })
  }

  const venue = await helper.getVenueByName(name)

  if (venue && venue.address === address) {
    const message = `Existe un venue con el name: ${name} y el address: ${address}.`
    return res.status(404).send({ message })
  }

  let cityData = await helper.getCityByName(city) // TODO mapBox a CABA | GBA lo tira como Buenos Aires

  if (!cityData) {
    // creo una nueva city
    console.log('no encontró la ciudad')

    // cityData = await helper.createCity(city)
    return res.status(404).send({ message: `No existe la city: ${city} en la BD.` })
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    const message = 'Latitude y longitude tienen que ser del tipo number.'
    return res.status(404).send({ message })
  }

  res.locals.data = {
    name,
    address,
    location,
    city_id: cityData.id,
    coordinates: { latitude, longitude },
  }

  next()
}
//----------------- DJS-----------------------

//----------------CITY--------------------------

//---------------TYPES----------------------------

module.exports = {
  validateVenueId,
  validateDataCreateVenue,
}
