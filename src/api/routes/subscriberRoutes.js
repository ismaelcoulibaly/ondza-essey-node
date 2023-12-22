/**
 * @openapi
 * /api/subscribers/subscribe:
 *   post:
 *     tags:
 *       - Subscriber
 *     summary: Subscribe to the newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscriber'
 *     responses:
 *       201:
 *         description: Subscribed successfully
 *       400:
 *         description: Error in subscription
 */

/**
 * @openapi
 * /api/subscribers/subscribers:
 *   get:
 *     tags:
 *       - Subscriber
 *     summary: Get all subscribers
 *     responses:
 *       200:
 *         description: A list of subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscriber'
 *       500:
 *         description: Error fetching subscribers
 */

const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/subscriberControllers');

// Route to subscribe to the newsletter
router.post('/subscribe', subscribe);

// Route to get all subscribers
router.get('/subscribers', getSubscribers);

module.exports = router;
