const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const reservationRoutes = require('./api/routes/reservationRoutes')
const subscriberRoutes = require('./api/routes/subscriberRoutes')
require('dotenv').config()

const app = express()
app.use(express.json())

mongoose.connect('mongodb://localhost:27017', {
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
    },
    servers: [
      {
        url: 'http://localhost:3000/', // Update this with your actual server URL
      },
    ],
  },
  apis: ['./src/api/routes/*.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/reservations', reservationRoutes);
app.use('/api/subscribers', subscriberRoutes);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app