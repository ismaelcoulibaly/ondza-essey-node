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

        await sendEmail({
            firstName: newReservation.firstName,
            lastName: newReservation.lastName,
            email: newReservation.email,
            phone: newReservation.phone,
            dateOfEvent: newReservation.dateOfEvent,
            numberOfGuests: newReservation.numberOfGuests,
            message: newReservation.message === undefined ? '' : newReservation.message,
            reservationType: newReservation.reservationType
        })
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
    const request = mailjet.post('send', { version: 'v3.1' }).request(
        {
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
                Subject: "Your email flight plan!",
                TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"

            }
        ]
    });

    return request
        .then((result) => {
            console.log('result body' ,result.body);
            console.log('result response ' , result.response);
            console.log('result ' ,result);

        })
        .catch((err) => {
            console.log(err.statusCode);
        });
}
