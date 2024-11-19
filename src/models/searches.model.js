const mongoose = require('mongoose');

const Searches = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        required: true
    },
    media: {
        type: Object,
        default: null,
        required: false
    },
    metadata: {
        type: Object,
        default: null,
        required: false
    },
    author: {
        type: Number,
        required: true
    },
    collObj: {
        type: Object,
        required: true
    },
    comment_count: {
        type: Number,
        default: 0,
        required: false
    },
    shares_count: {
        type: Number,
        default: 0,
        required: false
    },
    likes_count: {
        type: Number,
        default: 0,
        required: false
    },
    save_count: {
        type: Number,
        default: 0,
        required: false
    },
    expander: {
        type: Array,
        default: null,
        required: false
    },
    media_type: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        default: null,
        required: false
    },
    post_type: {
        type: String,
        default: null,
        required: false
    },
    tags: {
        type: Array,
        default: null,
        required: false
    },
    socialfeed_obj: {
        type: Object,
        default: null,
        required: false
    },
    is_favourite: {
        type: Boolean,
        default: false,
        required: false
    },
    socialfeedAt: {
        type: String,
        default: null,
        required: false
    },
    entityObj: {
        type: Object,
        default: null,
        required: false
    },
    createddate: {
        type: String,
        default: null,
        required: false
    },
    updateddate: {
        type: String,
        default: null,
        required: false
    },
    creatorName: {
        type: String,
        default: null,
        required: false
    },
    releaseDate: {
        type: String,
        default: null,
        required: false
    },
}, { timestamps: true });

Searches.index({ 
    "title": "text", 
    "description": "text",
    "url": "text",
    "collObj.name": "text",
    "media_type": "text"
})


module.exports = mongoose.model('searches', Searches);