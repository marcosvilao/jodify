const {Router} = require('express')
const session = require('express-session');
const passport = require('passport');
const {getEvents, createEvent, updateEvent, deleteEvent, searchEvent, filterEvents, scrapLink, UploadImage} = require('../controllers/event.controller')
const {getCities} = require('../controllers/city.controller')
// const {createUser, verifyUser} = require('../controllers/user.controller')
// const {checkAdmin} = require('../middlewares/authMiddleware'); 
const {getTypes} = require ('../controllers/type.controller');
const { getDjs } = require('../controllers/djs.controller');
const { getPromoters, postPromoters } = require('../controllers/promoters.controller');


const router = Router()



//events

router.get('/events', getEvents)

router.get('/events/search', searchEvent)

router.get('/events/filters', filterEvents)

router.post('/events', createEvent)

router.put('/events/:id', updateEvent)

router.delete('/events', deleteEvent)

router.post('/get-event-data', scrapLink)


//users

// router.post('/register', createUser)

// router.get('/login', (req,res) => {
//     res.render("login")
// })


// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/events',
//     failureRedirect: '/login',
//     failureMessage: true
// }));


//cities

router.get('/cities', getCities)


//tpyes

router.get('/types', getTypes)

//djs

router.get('/djs', getDjs)

//promoters

router.get('/promoters', getPromoters)

router.post('/create-promoters', postPromoters)








module.exports = router