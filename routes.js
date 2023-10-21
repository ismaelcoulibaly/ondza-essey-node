const express = require('express');
const router = express.Router();

const  { Reservation, Subscriber } = require('./models');

const sendGridMail= require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);


router.get('api/reservations', async (req, res) =>{
    const reservations = await Reservation.find();
    res.json(reservations);
});

router.post('api/', async (req, res) => {
    try{
        const reservation = new Reservation(req.body);
        await reservation.save();

        // Send confirmation email
        const msgToBooker = {
            to: reservation.email,
            from: 'ondza7@icloud.com',
            subject: 'Reservation Confirmation',
            text: 'Your reservation has been confirmed!'
        };
        await sendGridMail.send(msgToBooker);

        res.status(201).json(reservation);
    }catch (error) {
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
