const { Router } = require('express')
const { EventHelper } = require('../helpers/event.helper.js')
const fileUploadMiddleware = require('../middlewares/fileUploadMiddleware.js')
const {
  validateEventId,
  validateEventCreateData,
  validateGetAllEventsQuery,
  validateEventUpdateData,
} = require('../middlewares/event.middleware.js')
const { linkScrapping } = require('../utils/scrapping/scrapEventData.js')

const route = Router()

const helper = new EventHelper()

route.get('/search', async (req, res) => {
  const { searchQuery, limit, page } = req.query

  try {
    const event = await helper.searchEvent(String(searchQuery), Number(page), Number(limit))

    return res.status(200).send(event)
  } catch (error) {
    res.status(500).json({ message: 'Error searching for events' })
  }
})

route.get('/total-events', async (req, res) => {
  try {
    const totalEvents = await helper.getEventQuantity()

    return res.status(200).send({ totalEvents })
  } catch (error) {
    res.status(500).json({ message: 'Error total events' })
  }
})

route.get('/filters', validateGetAllEventsQuery, async (req, res) => {
  const { data } = res.locals
  try {
    const response = await helper.getAllEventsByFilter(data)

    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).json({ message: 'Error get events', error: error.message })
  }
})

route.get('/carousel', async (req, res) => {
  try {
    let data = await helper.getFeaturedEvents()

    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: message.error })
  }
})

route.put('/set-is-featured/:id', validateEventId, async (req, res) => {
  //TODO esto esta andando bien¡?
  const { id, event } = res.locals
  try {
    let data = await helper.setFeaturedEvent(id, event)
    if (typeof data !== 'boolean') res.status(404).json({ message: 'no es booleano' })
    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: message.error })
  }
})

route.get('/:id', validateEventId, async (req, res) => {
  const { event } = res.locals

  try {
    return res.status(200).send({ event })
  } catch (error) {
    return res.status(500).json({ message: 'Error get event' })
  }
})

route.post('/create', fileUploadMiddleware, validateEventCreateData, async (req, res) => {
  const { data } = res.locals
  try {
    const response = await helper.createEventByForm(data)

    if (!response) return res.status(404).send({ message: 'Error al crear evento' })

    return res.status(200).send({ message: 'Event created successfully', eventId: response })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating event', error: error.message })
  }
})

route.post('/check-link', async (req, res) => {
  const { link } = req.body

  try {
    const response = await helper.getEventByTicketLink(link)

    if (response) {
      return res.status(200).send({ message: response })
    }
    return res.status(404).send({ message: 'nop' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

route.patch('/add-interaction/:id', validateEventId, async (req, res) => {
  const { id, event } = res.locals

  console.log('event', event)
  try {
    await helper.updateEventInteraction(id, event)

    res.status(200).send({ message: 'Interaction added' })
  } catch (error) {
    return res.status(500).json({ message: 'Error add event interaction' })
  }
})

route.put(
  '/:id',
  fileUploadMiddleware,
  validateEventId,
  validateEventUpdateData,
  async (req, res) => {
    const { id, event, data } = res.locals

    try {
      await helper.updateEvent(id, data, event)

      return res.status(200).send({ message: 'Event updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error updating event' })
    }
  }
)

route.delete('/:id', validateEventId, async (req, res) => {
  const { id } = res.locals
  const { event } = res.locals

  try {
    await helper.deleteEvent(id, event)

    return res.status(200).send({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting events' })
  }
})

route.post('/get-event-data', async (req, res) => {
  try {
    const LINK = req.body.link
    console.log(LINK)
    let data = await linkScrapping(LINK)

    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: message.error })
  }
})

module.exports = route
