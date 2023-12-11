const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: { type: String, required: true },
    message: { type: String, required: true },
    reservationType: { type: String, enum: ['CULINARY_MASTERCLASSES', 'EXCLUSIVE_DININGS', 'TAILORED_CHEF_SERVICES'], required: true },
    phone: { type: Number, required: true },
    dateOfRequest: { type: Date, required: true },
    dateOfEvent: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true }
});

const subscriberSchema =  new mongoose.Schema({
    email: {type: String, require: true}
});

const Reservation = mongoose.model('Reservation', reservationSchema);
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = {
    Reservation,
    Subscriber,
    findReservationByEmail: (email) => Reservation.find({ email }),
    findFirstReservationByEmail: (email) => Reservation.findOne({ email }),
    findSubscriberByEmail: (email) => Subscriber.findOne({ email })
};