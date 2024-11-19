const Comment = require("../models/comments.model")

// Get all comments by pages
exports.getAllComments = async (page, perPage, pageName, pageId, skipCount) => {
    const [replies, totalCount] = await Promise.all([
        Comment.find({ page_type: pageName, page_id: pageId, parent_comment_id: null }).limit(perPage).skip(skipCount).populate("replies").sort({createdAt: -1}),
        Comment.find({ page_type: pageName, page_id: pageId }).count()
    ])
    return { replies, totalCount };
};

// Create Comment
exports.createComment = async (data) => {
    return await Comment.create(data);
};

// Edit Comment
exports.editComment = async (id, data) => {
    return await Comment.findByIdAndUpdate(id, { $set: data });
};

// Delete Multiple Comments
exports.deleteBulkComment = async (ids) => {
    return await Comment.deleteMany({_id: { $in: ids }})
}

// Delete Comment
exports.deleteComment = async (id) => {
    return await Comment.findByIdAndDelete(id);
};

// Get Single Comment
exports.getSingleComment = async (id) => {
    return await Comment.findById({ _id: id }).populate("replies");
};

// Send reply
exports.sendReplyToExistingComment = async (id, data) => {
    const comment = await Comment.findById(id);
    if (!comment.replies || !Array.isArray(comment.replies)) {
        // Create a new array with the data item
        comment.replies = [data];
    } else {
        // Append the data item to the existing array
        comment.replies.push(data);
    }
    // Save and return the updated document
    return await comment.save();
};

// Get all replies
exports.getAllReplies = async (parentId, page, perPage) => {
    const [replies, totalCount] = await Promise.all([
        Comment.find({ parent_comment_id: parentId }).limit(perPage).skip(page * perPage).select("-replies"),
        Comment.find({ parent_comment_id: parentId }).count()
    ])

    return { replies, totalCount };
}

// Like or Dislike Comment
exports.likeOrDislikeComment = async (id, userId, like, dislike) => {
    const comment = await Comment.findById(id);

    if (like) {
        const dislikeIndex = comment.dislike_count.findIndex((dc) => {
            return dc.userId === userId
        })
        if (dislikeIndex !== -1) comment.dislike_count.splice(dislikeIndex, 1)

        const likeIndex = comment.like_count.findIndex((lc) => {
            return lc.userId === userId
        })
        if (likeIndex === -1) comment.like_count.push({ userId });
    }
    if (dislike) {
        const likeIndex = comment.like_count.findIndex((lc) => {
            return lc.userId === userId
        })
        if (likeIndex !== -1) comment.like_count.splice(likeIndex, 1)

        const dislikeIndex = comment.dislike_count.findIndex((dc) => {
            return dc.userId === userId
        })
        if (dislikeIndex === -1) comment.dislike_count.push({ userId });
    }
    return await comment.save();
};

// Upvote or Downvote Comment
exports.downOrUpvotesComment = async (id, userId, upvotes, downvotes) => {
    const comment = await Comment.findById(id);
    if (upvotes) {
        const downvoteIndex = comment.downvotes.findIndex((dn) => { return dn.userId === userId })
        if (downvoteIndex !== -1) comment.downvotes.splice(downvoteIndex, 1);

        const upvoteIndex = comment.upvotes.findIndex((dn) => { return dn.userId === userId })
        if (upvoteIndex === -1) comment.upvotes.push({ userId });
    }
    if (downvotes) {
        const upvoteIndex = comment.upvotes.findIndex((up) => { return up.userId === userId })
        if (upvoteIndex !== -1) comment.upvotes.splice(upvoteIndex, 1);

        const downvoteIndex = comment.downvotes.findIndex((up) => { return up.userId === userId })
        if (downvoteIndex === -1) comment.downvotes.push({ userId });
    }
    return await comment.save();
};

// Block comments
exports.blockComment = async (id, is_blocked) => {
    const comment = await Comment.findById(id);
    comment.is_blocked = is_blocked;

    return await comment.save();
};
