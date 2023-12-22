const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const reservationRoutes = require('./api/routes/reservationRoutes')
const subscriberRoutes = require('./api/routes/subscriberRoutes')
require('dotenv').config()
const path = require('path');

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
    },
    servers: [
      {
        url: 'http://localhost:3000/', // Update this with your actual server URL
      },
    ],
    components: {
      schemas: {
        Reservation: {
          type: 'object',
          required: [
            'firstName',
            'lastName',
            'email',
            'message',
            'reservationType',
            'phone',
            'dateOfRequest',
            'dateOfEvent',
            'numberOfGuests',
          ],
          properties: {
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            message: {
              type: 'string',
            },
            reservationType: {
              type: 'string',
              enum: ['CULINARY_MASTERCLASSES', 'EXCLUSIVE_DININGS', 'TAILORED_CHEF_SERVICES'],
            },
            phone: {
              type: 'integer',
              format: 'int64',
            },
            dateOfRequest: {
              type: 'string',
              format: 'date-time',
            },
            dateOfEvent: {
              type: 'string',
              format: 'date-time',
            },
            numberOfGuests: {
              type: 'integer',
              format: 'int32',
            },
          },
        },
        Subscriber: {
          type: 'object',
          required: [
            'email',
          ],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
      },
    },
  },

  apis: ['./src/api/routes/*.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/reservations', reservationRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app