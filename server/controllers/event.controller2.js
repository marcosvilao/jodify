const { Router } = require('express')
const { EventHelper } = require('../helpers/event.helper.js')
const fileUploadMiddleware = require('../middlewares/fileUploadMiddleware.js')
const {
  validateEventId,
  validateEventCreateData,
  validateGetAllEventsQuery,
  validateEventUpdateData,
} = require('../middlewares/event.middleware.js')

const route = Router()

const helper = new EventHelper()

route.get('/search', async (req, res) => {
  const { searchQuery } = req.query

  try {
    const event = await helper.searchEvent(searchQuery)

    return res.status(200).send(event)
  } catch (error) {
    res.status(500).json({ message: 'Error searching for events' })
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

route.post('/create', validateEventCreateData, async (req, res) => {
  const { data } = res.locals
  try {
    console.log('data:', data)
    const response = await helper.createEvent(data)

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
      return res.status(200).send({ message: response }) //TODO queda raro que responsa un 200 cuando el ticket ya existe en la bd
    }
    return res.status(404).send({ message: 'nop' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

route.post('/filtersNew', validateGetAllEventsQuery, async (req, res) => {
  const { data } = res.locals
  try {
    const response = await helper.getAllEvents(data)

    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).json({ message: 'Error get events', error: error.message })
  }
})

route.patch('/add-interaction/:id', validateEventId, async (req, res) => {
  const { id, event } = res.locals

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
      await helper.updateEvent(id, data)

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
  // TODO remplazar ruta por: /scrap-event-data

  const { link } = req.body

  try {
    const data = await helper.scrapDataEvent(link)

    return res.status(200).send(data)
  } catch (error) {
    res.status(500).send({ message: message.error })
  }
})

module.exports = route
