const express = require('express');
const router = express.Router();
const { Reservation, Subscriber } = require('./models');
const mailjet = require('node-mailjet')
    .apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Retrieve a list of reservations
 *     responses:
 *       200:
 *         description: A list of reservations.
 */
router.get('/api/reservations', async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
});

/**
 * @swagger
 * /api/reservation/create:
 *   post:
 *     summary: Create a reservation for a customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the customer.
 *               lastName:
 *                 type: string
 *                 description: The last name of the customer.
 *               email:
 *                 type: string
 *                 description: The email address of the customer.
 *               message:
 *                 type: string
 *                 description: Any message or special request from the customer.
 *               reservationType:
 *                 type: string
 *                 enum: ['CULINARY_MASTERCLASSES', 'EXCLUSIVE_DININGS', 'TAILORED_CHEF_SERVICES']
 *                 description: The type of reservation.
 *               phone:
 *                 type: string
 *                 description: The phone number of the customer.
 *               dateOfRequest:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the reservation was requested.
 *               dateOfEvent:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time of the event.
 *               numberOfGuests:
 *                 type: integer
 *                 description: The number of guests for the reservation.
 *     responses:
 *       201:
 *         description: Create a reservation based on the information the user sent.
 *       400:
 *         description: Bad request, the provided data was invalid.
 *       500:
 *         description: Server error, could not create reservation.
 */
router.post('/api/reservation/create', async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();

        // Send confirmation email
        const request = mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [{
                    "From": {
                        "Email": "ondza7@icloud.com",
                        "Name": "Ondza Essey"
                    },
                    "To": [{
                        "Email": reservation.email,
                    }],
                    "Subject": "Reservation Confirmation",
                    "TextPart": "Your reservation has been confirmed!"
                }]
            });

        request
            .then((result) => {
                console.log(result.body);
                res.status(201).json(reservation);
            })
            .catch((err) => {
                console.log(err.statusCode);
                res.status(500).json({ error: err.message });
            });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Add a user to the newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Create add a user to the newsletter.
 *       400:
 *         description: Bad request, email already subscribed or other error.
 */
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

/**
 * @swagger
 * /api/reservation/{id}:
 *   get:
 *     summary: Retrieve a reservation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the reservation to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The reservation data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 */
router.get('/api/reservation/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({error: error.message});

    }
});
module.exports = router;
