const express = require('express')
const router = express.Router()
const { Reservation } = require('../models')

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
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find()
    res.json(reservations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Route to create a new reservation
/**
 * @swagger
 * /reservation/create:
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
router.post('/reservation/create', async (req, res) => {
  const reservation = new Reservation(req.body)
  try {
    const newReservation = await reservation.save()
    // Send email logic goes here
    res.status(201).json(newReservation)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Add more routes as needed...

module.exports = router
