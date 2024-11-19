const mongoose = require('mongoose');

const Comments = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    comment_by: {
        type: Object,
        required: true
    },
    like_count: {
        type: Array,
        default: []
    },
    dislike_count: {
        type: Array,
        default: []
    },
    comment_to: {
        type: Object
    },
    page_type: {
        type: String,
        required: true
    },
    page_id: {
        type: Number,
        required: true
    },
    parent_comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    floatingCommentData: {
        type: Object,
        required: true
    },
    upvotes: {
        type: Array,
        default: []
    },
    downvotes: {
        type: Array,
        default: []
    },
    comment_type: {
        type: String,
        default: 'normal'
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('comment', Comments);