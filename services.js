const {
    Reservation,
    Subscriber,
    findReservationByEmail,
    findFirstReservationByEmail,
    findSubscriberByEmail
} = require('./models');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY);

const isValidEmail = (email) => {
    const regex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    return regex.test(email);
};

const isValidPhone = (phone) => {
    const regex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return regex.test(phone.toString());
};
const createReservation = async (reservationData) => {
    if (!isValidEmail(reservationData.email)) {
        throw new Error("Invalid email format");
    }

    if (!isValidPhone(reservationData.phone)) {
        throw new Error("Invalid phone format");
    }

    const reservation = new Reservation(reservationData);
    return await reservation.save();
};

const getReservationById = async (id) => {
    return await Reservation.findById(id);
};

const getAllReservations = async () => {
    return await Reservation.find();
};

const updateReservation = async (id, updatedData) => {
    return await Reservation.findByIdAndUpdate(id, updatedData, { new: true });
};

const deleteReservation = async (id) => {
    return await Reservation.findByIdAndDelete(id);
};

const subscribeToNewsletter = async (email) => {
    const existingSubscriber = await findSubscriberByEmail(email);
    if (existingSubscriber) {
        throw new Error("Email already subscribed");
    }

    const subscriber = new Subscriber({ email });
    return await subscriber.save();
};

const sendNewsletter = async (to, subject, body) => {
    const msg = {
        to,
        from: 'ondza7@icloud.com',
        subject,
        text: body
    };
    await sgMail.send(msg);
};

module.exports = {
    createReservation,
    getReservationById,
    getAllReservations,
    updateReservation,
    deleteReservation,
    subscribeToNewsletter,
    sendNewsletter
};
