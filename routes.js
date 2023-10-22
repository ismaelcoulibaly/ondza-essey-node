const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Reservation, Subscriber } = require('./models');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourgmail@gmail.com',
        pass: 'yourapplicationpassword'
    }
});

router.get('/api/reservations', async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
});

router.post('/api/reservations/create', async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();

        // Send confirmation email
        const msgToBooker = {
            from: 'yourgmail@gmail.com', // Sender's email address
            to: reservation.email, // Recipient's email address
            subject: 'Reservation Confirmation',
            text: 'Your reservation has been confirmed!'
        };
        await transporter.sendMail(msgToBooker);

        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const existingSubscriber = await Subscriber.findOne({ email: req.body.email });
        if (existingSubscriber) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }

        const subscriber = new Subscriber({ email: req.body.email });
        await subscriber.save();
        res.json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
