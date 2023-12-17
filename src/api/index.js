const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const reservationRoutes = require('./routes/reservationRoutes')
const swaggerDocument = require('./swagger.json');
require('dotenv').config()

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err))


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chef Reservation API',
      version: '1.0.0',
      description: 'API for managing chef reservations and newsletter subscriptions'
    }
  },
  apis: ['./routes/*.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/api', reservationRoutes)
app.use('/api', reservationRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default  app;