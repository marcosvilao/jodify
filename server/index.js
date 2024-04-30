const express = require('express')
//-------------------
const routes = require('./routes/routes.js')
//------------------
// const passport = require('passport');
const morgan = require('morgan')
const cors = require('cors')
// const session = require('express-session')
// const FileStore = require('session-file-store')(session)
// const {v4: uuidv4} = require('uuid')
// const passportConfig = require('./passport-config');
const flash = require('express-flash')
const path = require('path')
const bodyParser = require('body-parser')

require('dotenv').config()

const eventRoutes = require('./routes/events.routes')

const app = express()

app.use(function (req, res, next) {
  var allowedOrigins = [
    'https://jodify.com.ar',
    'https://jodify.vercel.app',
    'https://jodify-qa-client.vercel.app',
    'https://l.instagram.com/',
    'https://jodifynext.vercel.app',
    'https://jodify-qa-next.vercel.app',
  ]
  var origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.set('view engine', 'ejs') // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')) // Set the views directory
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());
app.use(morgan('dev'))
app.use(express.json())

// app.use(flash());
// app.use(
//     session({
//         genid:(req) => {
//             return uuidv4()
//         },
//         store: new FileStore(),
//         secret: process.env.PRIVATE_SESSION_KEY,
//         resave: false,
//         saveUninitialized: false
//     })
// )

// app.use(passport.initialize());
// app.use(passport.session());

// passportConfig(passport);

//-------------------------

// app.use(eventRoutes);


app.use(routes);

app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  })
})

app.listen(3001, () => console.log(`listening on port 3001`))
