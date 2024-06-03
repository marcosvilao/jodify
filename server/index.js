const express = require('express');
const routes = require('./routes/routes.js'); // Tus rutas
const morgan = require('morgan');
const cors = require('cors');
// const flash = require('express-flash');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

// const eventRoutes = require('./routes/events.routes'); // Asumo que no necesitas este archivo de rutas

const app = express();

// Configuración de CORS
const allowedOrigins = [
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
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  optionsSuccessStatus: 204
}));

// Configurar otras cabeceras CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Otros middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Middleware de sesión y flash (comentado porque no es necesario ahora)
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
// )

// Inicialización de Passport (comentado porque no es necesario ahora)
// app.use(passport.initialize());
// app.use(passport.session());

// passportConfig(passport);

// Uso de rutas
app.use(routes); // Tus rutas

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  });
});

// Iniciar el servidor
app.listen(3001, () => console.log(`listening on port 3001`));
