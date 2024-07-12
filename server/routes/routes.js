const { Router } = require('express')
const event = require('../controllers/event.controller.js')
const promoter = require('../controllers/promoters.controller.js')
const generic = require('../controllers/generic.controller.js')
const user = require('../controllers/user.controller.js')

const router = Router()

router.use('/events', event)

router.use('/promoters', promoter)

router.use('/jodify', generic)

router.use('/user', user)

module.exports = router
