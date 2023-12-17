const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/subscriberController');

// Route to subscribe to the newsletter
router.post('/subscribe', subscribe);

// Route to get all subscribers
router.get('/subscribers', getSubscribers);

module.exports = router;
