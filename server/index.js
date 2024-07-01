const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const flash = require('express-flash');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const routes = require('./routes/routes.js');
const eventRoutes = require('./routes/events.routes');

const app = express();

// Lista de IPs permitidas
const allowedIPs = [
  '181.117.167.211',
  '181.46.138.66',
  '190.97.16.232'
];

// Lista de dominios permitidos
const allowedOrigins = [
  'https://jodify.com.ar',
  'https://jodify-qa-client.vercel.app',
  'https://l.instagram.com/',
  'https://jodifynext.vercel.app',
];

app.set('trust proxy', true);

// Middleware para verificar el origen y las IPs
const originAndIPFilter = (req, res, next) => {
  const origin = req.headers.origin;
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log('ip address', ip)
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    return next();
  }

  if (allowedIPs.includes(ip)) {
    return next();
  }

  res.status(403).json({ message: 'Forbidden' });
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Aplicar el middleware a todas las rutas
app.use(originAndIPFilter);

// Rutas de la aplicación
app.use(routes);

app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  });
});

app.listen(3001, () => console.log('listening on port 3001'));
