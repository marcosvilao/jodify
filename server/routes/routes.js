const { Router } = require('express')
const event = require('../controllers/event.controller2.js')
const promoter = require('../controllers/promoters.controller2.js')
const generic = require('../controllers/generic.controller.js')

const router = Router()

router.use('/events', event)

router.use('/promoters', promoter)

router.use('/jodify', generic)

module.exports = router
