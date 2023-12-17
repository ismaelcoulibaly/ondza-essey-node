const express = require('express');
const router = express.Router();
const { createReservation, getReservations } = require('../controllers/reservationController');

// Route to create a new reservation
/**
 * @swagger
 * /reservations/create:
 *   post:
 *     summary: Create a new reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created
 *       400:
 *         description: Error in creating reservation
 */
router.post('/reservations/create', createReservation);

// Route to get all reservations
/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Retrieve a list of reservations
 *     responses:
 *       200:
 *         description: A list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/reservations', getReservations);

module.exports = router;
