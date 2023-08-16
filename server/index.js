const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const eventRoutes = require('./routes/events.routes')

const app = express();

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use(eventRoutes)



app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
})

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`))