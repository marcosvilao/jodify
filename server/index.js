const express = require('express')
const routes = require('./routes/routes.js')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const { sequelize } = require('./models/associations.js')

const app = express()

// Lista de IPs permitidas
const allowedIPs = [
  '::ffff:192.168.1.9',
  '::ffff:192.168.1.8',
  '::ffff:192.168.0.36',
  '::ffff:192.168.0.3',
  '::ffff:192.168.1.10',
  '::ffff:10.0.1.72',
  '::ffff:181.13.127.90',
  '::ffff:10.0.0.185',
  '::ffff:192.168.2.2',
  '::ffff:192.168.2.3',
  '::ffff:192.168.2.4',
  '181.117.167.211',
  '181.46.138.66',
  '190.97.16.232',
  '159.223.206.132',
  '::1',

  '*',
]

// Lista de dominios permitidos
const allowedOrigins = [
  'https://jodify.com.ar',
  'https://jodify-qa-client.vercel.app',
  'https://l.instagram.com/',
  'https://jodifynext.vercel.app',

  '*',
]

app.set('trust proxy', true)

// Middleware para verificar el origen y las IPs
const originAndIPFilter = (req, res, next) => {
  const origin = req.headers.origin
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress
  console.log('ip address', ip)

  // Verifica si '*' está presente en allowedOrigins o allowedIPs
  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    return next()
  }

  if (allowedIPs.includes('*') || allowedIPs.includes(ip)) {
    return next()
  }

  res.status(403).json({ message: 'Forbidden' })
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.set('view engine', 'ejs') // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')) // Set the views directory
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Aplicar el middleware a todas las rutas
app.use(originAndIPFilter)

// Rutas de la aplicación
app.use(routes)

app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  })
})

sequelize
  .sync({ alter: false })
  .then(() => {
    app.listen(3001, () => console.log('listening on port 3001'))
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })
