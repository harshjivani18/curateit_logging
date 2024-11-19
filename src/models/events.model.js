const mongoose = require('mongoose');

const Events = new mongoose.Schema({
    event_type: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('events', Events);