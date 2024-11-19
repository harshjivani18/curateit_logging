const mongoose = require('mongoose');

const Activitylog = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: true
    },
    actionType: {
        type: String,
        required: true
    },
    count: {
        type: Number,
    },
    author: {
        type: Object,
        required: true
    },
    collection_info: {
        type: Object,
    },
    gems_info: [
        {
            type: Object,
        }
    ],
    prompt_info: {
        type: Object
    }
}, {timestamps: true});

module.exports = mongoose.model('activitylog', Activitylog);