const {Router} = require('express')
const session = require('express-session');
const passport = require('passport');
const {getEvents, createEvent, updateEvent, deleteEvent, searchEvent, filterEvents, scrapLink, uploadImage} = require('../controllers/event.controller')
const {getCities} = require('../controllers/city.controller')
// const {createUser, verifyUser} = require('../controllers/user.controller')
// const {checkAdmin} = require('../middlewares/authMiddleware'); 
const {getTypes} = require ('../controllers/type.controller')
const multer = require('multer');
const path = require('path');

const router = Router()

const storage = multer.diskStorage({
    destination: 'uploads/', // Define the directory to store uploaded files
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });

//events

router.get('/events', getEvents)

router.get('/events/search', searchEvent)

router.get('/events/filters', filterEvents)

router.post('/events', createEvent)

router.put('/events/:id', updateEvent)

router.delete('/events', deleteEvent)

router.post('/get-event-data', scrapLink)

router.post('/upload', upload.single('event_image'), uploadImage)

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






module.exports = router