const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
    try {
        const newSubscriber = new Subscriber({ email: req.body.email });
        await newSubscriber.save();
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
