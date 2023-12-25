const Reservation = require('../models/Reservation');

let mailjetApiKey = process.env.MAILJET_API_KEY
let mailjetSecretKey = process.env.MAILJET_SECRET_KEY
const mailjet = require('node-mailjet').connect(mailjetApiKey, mailjetSecretKey);

exports.createReservation = async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        sendEmail({
            firstName: newReservation.firstName,
            lastName: newReservation.lastName,
            email: newReservation.email,
            phone: newReservation.phone,
            dateOfEvent: newReservation.dateOfEvent,
            numberOfGuests: newReservation.numberOfGuests,
            additionalInfo: newReservation.additionalInfo,
            reservationType: newReservation.reservationType
        })
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



function sendEmail(variables) {
    const request = mailjet.post("send", { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: "jason@ondza.ca",
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
        });
}
