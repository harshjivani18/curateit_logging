const mongoose = require('mongoose');

const Prompts = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    share_type: {
        type: String,
        default: 'Private'
    },
    prompt_type: {
        type: String,
        default: 'User'
    },
    icon: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    gem: {
        type: Object,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    total_count: {
        type: Number,
        default: 0
    },
    output_type: {
        type: String,
        default: 'Text'
    }
}, { timestamps: true });

Prompts.index({name: 1, prompt: 1})

module.exports = mongoose.model('prompts', Prompts);