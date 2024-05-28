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
  let { name, address, neighborhood, city, province, latitude, longitude, cityLat, cityLng } =
    req.body

  if (
    !name ||
    !address ||
    !neighborhood ||
    !city ||
    !latitude ||
    !longitude ||
    !province ||
    !cityLat ||
    !cityLng
  ) {
    const message =
      'Para crear un venue debe agregar name, address, neighborhood, city, province, latitude, longitude, cityLat y cityLng.'
    return res.status(404).send({ message })
  }

  const venue = await helper.getVenueByName(name)

  if (venue && venue.address === address) {
    const message = `Existe un venue con el name: ${name} y el address: ${address}.`
    return res.status(404).send({ message })
  }

  if (typeof cityLat !== 'number' || typeof cityLng !== 'number') {
    const message = 'cityLat y cityLng tienen que ser del tipo number.'
    return res.status(404).send({ message })
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    const message = 'Latitude y longitude tienen que ser del tipo number.'
    return res.status(404).send({ message })
  }

  let cityData = await helper.getCityByCoords(cityLat, cityLng)

  if (!cityData) {
    const newCity = await helper.createCity(city, cityLat, cityLng)

    if (!newCity) {
      return res.status(404).send({
        message: `Error al crear una nueva city. Name: ${city}, coords: lat ${cityLat} | long ${cityLng}`,
      })
    }

    cityData = newCity
  }

  res.locals.data = {
    name,
    address,
    neighborhood,
    province,
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
