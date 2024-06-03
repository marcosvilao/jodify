const express = require('express');
const routes = require('./routes/routes.js');
const eventRoutes = require('./routes/events.routes');
const morgan = require('morgan');
const cors = require('cors');
const flash = require('express-flash');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

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
  origin: function(origin, callback) {
    // permitir solicitudes sin origin, como las de curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

app.use(flash());

// Rutas
app.use('/events', eventRoutes);
app.use(routes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
