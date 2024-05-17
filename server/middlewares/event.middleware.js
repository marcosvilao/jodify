const { EventHelper } = require('../helpers/event.helper.js')
const uploadImg = require('../utils/cloudinary/auxFunctionsCloudinary.js')
const file = require('../utils/cloudinary/files.js')
const { UUIDV4RegEx } = require('../utils/regex.js')
const { PromoterHelper } = require('../helpers/promoters.helper.js')
const { GenericHelper } = require('../helpers/generic.helper.js')

const helper = new EventHelper()
const helperPromoter = new PromoterHelper()
const helperGeneric = new GenericHelper()

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
  let {
    name,
    venue,
    image_url,
    date_from,
    event_city,
    ticket_link,
    event_type,
    event_djs,
    event_promoter,
  } = req.body

  let imageCloud

  if (!venue || !date_from || !event_city || !ticket_link) {
    const message =
      'Para crear un producto debe ingresar name, venue, date_from, event_city, ticket_link'
    return res.status(404).send({ message })
  }
  event_type = event_type ? JSON.parse(event_type) : null
  event_djs = event_djs ? JSON.parse(event_djs) : null
  event_promoter = event_promoter ? JSON.parse(event_promoter) : null
  event_city = event_city ? JSON.parse(event_city) : null

  if (req.files?.image && !image_url) {
    // if (!req.files?.image) {
    //   const message = 'To create a product you need a image'
    //   return res.status(404).send({ message })
    // }
    const { image } = req.files

    const response = await uploadImg(image, file.EVENTS)

    if (typeof response === 'string') {
      const message = 'Error Cloudinary response'
      return res.status(404).send({ message })
    }

    imageCloud = response[0]
  }

  const data = {
    name,
    image: image_url ? { image_url } : imageCloud,
    venue,
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
  let { dates, citiesId, typesId, search, page, sharedId, limit, status, promoterId } = req.query

  if (typesId) {
    typesId = String(typesId).split(',')
    const invalidUuidv4 = typesId.find((e) => !UUIDV4RegEx.test(e))
    if (invalidUuidv4) {
      const message = `El id del type: '${invalidUuidv4}' es invalido.`
      return res.status(404).send({ message })
    }
  }

  if (status && String(status) !== 'finalized') {
    const message = `El único valor valido para status es 'finalized'.`
    return res.status(404).send({ message })
  }

  if (promoterId && !UUIDV4RegEx.test(String(promoterId))) {
    const message = `promoterId: '${promoterId}' no es un uuid valido.`
    return res.status(404).send({ message })
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

  res.locals.data = { dates, citiesId, typesId, search, page, sharedId, limit, status, promoterId }

  next()
}

async function validateEventUpdateData(req, res, next) {
  let { name, venue, date_from, event_city, ticket_link, event_type, event_djs, event_promoter } =
    req.body

  if (
    !name &&
    !date_from &&
    !ticket_link &&
    !venue &&
    !event_city &&
    !event_djs &&
    !event_promoter &&
    !event_type
  ) {
    const message =
      'Para actualizar un evento debe ingresar alguno de los siguientes parámetros: name, date_from, ticket_link, venue, city_id, event_djs, event_promoter o event_type.'
    return res.status(404).send({ message })
  }

  event_type = event_type ? JSON.parse(event_type) : null
  event_djs = event_djs ? JSON.parse(event_djs) : null
  event_promoter = event_promoter ? JSON.parse(event_promoter) : null
  event_city = event_city ? JSON.parse(event_city) : null

  let imageCloud = null

  if (req.files?.image) {
    const { image } = req.files

    const response = await uploadImg(image, file.EVENTS)

    if (typeof response === 'string') {
      const message = 'Error Cloudinary response'
      return res.status(404).send({ message })
    }

    imageCloud = response[0]
  }

  res.locals.data = {
    name,
    venue,
    date_from,
    event_city: event_city ? event_city.id : null,
    ticket_link,
    event_type,
    event_djs,
    event_promoter,
    image: imageCloud ?? null,
  }

  next()
}

module.exports = {
  validateEventCreateData,
  validateGetAllEventsQuery,
  validateEventId,
  validateEventUpdateData,
}
