const Reservation = require('../models/Reservation');

require('dotenv').config();
const Mailjet = require('node-mailjet');


const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY || 'your-api-key',
    apiSecret: process.env.MAILJET_SECRET_KEY || 'your-api-secret'
});

exports.createReservation = async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        const variables = {
            firstName: newReservation.firstName,
            lastName: newReservation.lastName,
            email: newReservation.email,
            phone: newReservation.phone,
            dateOfEvent: newReservation.dateOfEvent,
            numberOfGuests: newReservation.numberOfGuests,
            message: newReservation.message === undefined ? '' : newReservation.message,
            reservationType: newReservation.reservationType
        };
        await newReservation.save();
        console.log('Sending email with variables:', variables);
        sendEmail(variables)
        res.status(201).json(newReservation);
    } catch (error) {

        res.status(400).json({ message: error.message });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ dateOfCreation: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



function sendEmail(variables) {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: "ismael-coulibaly@outlook.com",
                    Name: "Ondza website"
                },
                To: [
                    {
                        Email: "jason.ngolley@icloud.com",
                        Name: "Jason Ngolley"
                    }
                ],
                TemplateID: 5493770,
                TemplateLanguage: true,
                Subject: "New Reservation on Ondza",
                Variables: {
                    ...variables,
                    dateOfEvent: new Date(variables.dateOfEvent).toLocaleString()
                }
            }
        ]
    });

    request
        .then((result) => {
            console.log(result.body);
            
        })
        .catch((err) => {
            console.log(err.statusCode);
            console.error('Error sending email:', err.statusCode, err.message);

        });
}
