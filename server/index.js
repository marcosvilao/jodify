const express = require('express');
const routes = require('./routes/routes.js');
const morgan = require('morgan');
const cors = require('cors');
const flash = require('express-flash');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

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

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true, // Permitir credenciales como cookies
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Configurar otras cabeceras CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true'); // Permitir credenciales como cookies
  if (req.method === 'OPTIONS') {
    res.sendStatus(204); // Responder con 204 para solicitudes preflight (OPTIONS)
  } else {
    next();
  }
});

// Otros middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

app.use(routes);

app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  });
});

app.listen(3001, () => console.log(`listening on port 3001`));
