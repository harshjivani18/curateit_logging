const mongoose = require('mongoose');

const Thread = new mongoose.Schema({
    prompts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'threadPrompts'
    }],
    user: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('thread', Thread);