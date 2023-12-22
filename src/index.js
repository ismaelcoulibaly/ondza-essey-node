  const express = require('express')
  const mongoose = require('mongoose')
  const swaggerUi = require('swagger-ui-express')
  const swaggerJsdoc = require('swagger-jsdoc')
  const reservationRoutes = require('./api/routes/reservationRoutes')
  const subscriberRoutes = require('./api/routes/subscriberRoutes')
  require('dotenv').config()
  const path = require('path');
  const { MongoClient, ServerApiVersion } = require('mongodb');

  const app = express()
  app.use(express.json())
  const cors = require('cors');

  app.use(cors());
  const uri = process.env.MONGODB_URI;
  console.log('process.env.MONGODB_URI', process.env.MONGODB_URI)
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

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
          url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
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

    apis: [`${__dirname}/api/routes/*.js`]
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