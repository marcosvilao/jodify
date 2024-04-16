const { EventHelper } = require('../helpers/event.helper.js')
const { uploadImg } = require('../utils/cloudinary/auxFunctionsCloudinary.js')
const file = require('../utils/cloudinary/files.js')
const { UUIDV4RegEx } = require('../utils/regex.js')

const helper = new EventHelper()

async function validateEventId(req, res, next) {
  const { id } = req.params

  if (!UUIDV4RegEx.test(id)) {
    const message = 'Debe ingresar un ID valido.'
    return res.status(404).send({ message })
  }

  const event = await helper.getEventById(id)

  if (!event) {
    const message = `No se encontro ningun evento con el id: ${id}`
    return res.status(404).send({ message })
  }

  res.locals.id = id
  res.locals.event = event

  next()
}

async function validateEventCreateData(req, res, next) {
  const {
    name,
    venue,
    image_url, // esta no va a estar
    date_from,
    event_city,
    ticket_link,
    event_type,
    event_djs,
    event_promoter,
  } = req.body.event

  // event_type = Array.isArray(event_type) ? event_type : event_type?.split(',') // arrays

  if (!name || !venue || !date_from || !event_city || !ticket_link) {
    const message = 'Para crear un producto debe ingresar..'
    return res.status(404).send({ message })
  }

  // if (!req.files?.image) {
  //   const message = 'To create a product you need a image'
  //   return res.status(404).send({ message })
  // }
  // const { image } = req.files

  // const response = await uploadImg(image, file.EVENTS)

  // if (typeof response === 'string') {
  //   const message = 'Error Cloudinary response'
  //   return res.status(404).send({ message })
  // }

  const data = {
    name,
    //   image: response,
    venue,
    image_url,
    date_from,
    event_city,
    ticket_link,
    event_type,
    event_djs,
    event_promoter,
  }

  res.locals.data = data
  next()
}

async function validateGetAllEventsQuery(req, res, next) {
  let { dates, citiesId, typesId, search, page, sharedId, limit } = req.query

  if (typesId) {
    typesId = String(typesId).split(',')
    const invalidUuidv4 = typesId.find((e) => !UUIDV4RegEx.test(e))
    if (invalidUuidv4) {
      const message = `El id del type: '${invalidUuidv4}' es invalido.`
      return res.status(404).send({ message })
    }
  }

  if (citiesId) {
    citiesId = String(citiesId).split(',')
    const invalidUuidv4 = citiesId.find((e) => !UUIDV4RegEx.test(e))
    if (invalidUuidv4) {
      const message = `El id del city: '${invalidUuidv4}' es invalido.`
      return res.status(404).send({ message })
    }
  }
  if (dates) {
    dates = String(dates).split(',')
  }

  if (page === undefined) {
    // const message = 'debe ingresar el numero de la pagina'
    // return res.status(404).send({ message })
    page = 0
  }

  res.locals.data = { dates, citiesId, typesId, search, page, sharedId, limit }

  next()
}

async function validateEventUpdateData(req, res, next) {
  const { title, date, image, link, djs } = req.body

  res.locals.data = { title, date, image, link, djs }

  next()
}

module.exports = {
  validateEventCreateData,
  validateGetAllEventsQuery,
  validateEventId,
  validateEventUpdateData,
}
