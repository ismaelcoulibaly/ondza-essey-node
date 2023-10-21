require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: ["https://ondza-essey-backend-production.up.railway.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["*"],
    credentials: true
};

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Reservation API',
            version: '1.0.0',
        },
    },
    apis: ['./routes.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

mongoose.connect('mongodb://localhost:27017/reservationDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
