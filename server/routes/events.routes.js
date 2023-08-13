const {Router} = require('express')

const {getEvents, createEvent, updateEvent, deleteEvent} = require('../controllers/event.controller')

const router = Router()

router.get('/events', getEvents)

router.post('/events', createEvent)

router.put('/events/:id', updateEvent)

router.delete('/events', deleteEvent)

module.exports = router