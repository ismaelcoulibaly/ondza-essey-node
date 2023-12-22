const express = require('express');
const router = express.Router();
const { createReservation, getReservations } = require('../controllers/reservationController');

// Route to create a new reservation
/**
 * @swagger
 * /api/reservations/create:
 *   post:
 *     tags:
 *       - Reservation
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
router.post('/create', createReservation);

// Route to get all reservations
/**
 * @swagger
 * /api/reservations:
 *   get:
 *     tags:
 *       - Reservation
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
router.get('/', getReservations);

module.exports = router;
