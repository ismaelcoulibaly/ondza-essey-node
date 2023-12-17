const express = require('express');
const router = express.Router();
const { createReservation, getReservations } = require('../controllers/reservationController');

// Route to create a new reservation
router.post('/reservations/create', createReservation);

// Route to get all reservations
router.get('/reservations', getReservations);

module.exports = router;
