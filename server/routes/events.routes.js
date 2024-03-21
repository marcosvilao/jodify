const { Router } = require("express");
const session = require("express-session");
const passport = require("passport");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvent,
  scrapLink,
  UploadImage,
  filterEventsNew,
} = require("../controllers/event.controller");
const { getCities } = require("../controllers/city.controller");
// const {createUser, verifyUser} = require('../controllers/user.controller')
// const {checkAdmin} = require('../middlewares/authMiddleware');
const { getTypes } = require("../controllers/type.controller");
const { getDjs } = require("../controllers/djs.controller");
const {
  getPromoters,
  postPromoters,
} = require("../controllers/promoters.controller");
const {
  createUser,
  getUser,
  getAuth0User,
  createAuth0User,
} = require("../controllers/user.controller.js");
const {
  postResetPassword,
  postResetPasswordEmail,
} = require("../controllers/resetPassword.controllers.js");

const router = Router();

//events

router.get("/events", getEvents);

router.get("/events/search", searchEvent);

router.post("/events", createEvent);

router.put("/events/:id", updateEvent);

router.delete("/events", deleteEvent);

router.post("/get-event-data", scrapLink);

router.post("/events/filtersNew", filterEventsNew);

//users

router.post("/create-users", createUser);
router.post("/login", getUser);
router.post("/auth0/login", getAuth0User);
router.post("/auth0/register", createAuth0User);

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

router.get("/cities", getCities);

//tpyes

router.get("/types", getTypes);

//djs

router.get("/djs", getDjs);

//promoters

router.get("/promoters", getPromoters);

router.post("/create-promoter", postPromoters);

module.exports = router;

// reset password routes

router.post("/reset-password", postResetPassword);
router.post("/reset-password/:id/:token", postResetPasswordEmail);