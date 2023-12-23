const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: false },
    reservationType: { type: String, enum: ['CULINARY_MASTERCLASSES', 'EXCLUSIVE_DININGS', 'TAILORED_CHEF_SERVICES'], required: true },
    phone: { type: Number, required: true },
    dateOfRequest: { type: Date, required: true, default: Date.now},
    dateOfEvent: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
