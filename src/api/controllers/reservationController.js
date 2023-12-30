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
            dateOfEvent: convertIsoToHumanReadable(newReservation.dateOfEvent),
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



function sendEmail(emailVariables) {
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
                TemplateID: 5493770,
                TemplateLanguage: true,
                Variables: emailVariables,
            }
        ]
    });

    return request
        .then((result) => {
            console.log('result body' ,result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
        });
}

const convertIsoToHumanReadable = (isoString) => {
    const date = new Date(isoString);
    const humanReadableDate = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
    return humanReadableDate;
};

