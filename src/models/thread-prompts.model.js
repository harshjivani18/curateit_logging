const mongoose = require('mongoose');

const ThreadPrompts = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    ai_response: {
        type: Object,
        required: true
    },
    gems: {
        type: Array,
        default: []
    },
    // prompts: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'thread'
    // },
    user: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('threadPrompts', ThreadPrompts);