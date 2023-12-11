const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes'); // make sure the path is correct based on your project structure
const swaggerJsDoc = require('swagger-jsdoc');

// Initialize Express app
const app = express();

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for My App',
        version: '1.0.0',
    },
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    apis: [require('./routes/*.js')], // Update path if necessary
};

const swaggerDocs = swaggerJsDoc(options);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger Documentation Setup
app.use('/', routes);
app.use('/api-docs', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', routes);

// Catch-all for routes not found
app.use((req, res, next) => {
    res.status(401).send('Page not found');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the app as a function
exports.app = functions.https.onRequest(app);
