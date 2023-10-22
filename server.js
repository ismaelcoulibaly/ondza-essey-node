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

// MongoDB's connection URL - replace username, password and your_cluster_url with your actual MongoDB credentials
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB: ', err));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
app.get('/swagger', (req, res) => {
    res.send(swaggerUi.generateHTML(swaggerDocs));
});
app.use((req, res) => {
    res.status(404).send('Page not found');
  });
  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
