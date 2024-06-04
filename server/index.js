const express = require('express');
//-------------------
const routes = require('./routes/routes.js');
//------------------
// const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
// const { v4: uuidv4 } = require('uuid');
// const passportConfig = require('./passport-config');
const flash = require('express-flash');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

// const eventRoutes = require('./routes/events.routes');

const app = express();

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://jodify.com.ar',
  'https://jodify.vercel.app',
  'https://jodify-qa-client.vercel.app',
  'https://l.instagram.com/',
  'https://jodifynext.vercel.app',
  'https://jodify-qa-next.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],  // Añadir Authorization aquí
  optionsSuccessStatus: 204
}));

// Configurar otras cabeceras CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');  // Añadir Authorization aquí también
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');  // Asegúrate de incluir PATCH y PUT si los estás utilizando
  next();
});

// Otros middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// app.use(flash());
// app.use(
//     session({
//         genid: (req) => {
//             return uuidv4()
//         },
//         store: new FileStore(),
//         secret: process.env.PRIVATE_SESSION_KEY,
//         resave: false,
//         saveUninitialized: false
//     })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// passportConfig(passport);

//-------------------------

// app.use(eventRoutes);

app.use(routes);

app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  });
});

app.listen(3001, () => console.log(`listening on port 3001`));
