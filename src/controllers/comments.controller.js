const { createComment, getSingleComment, sendReplyToExistingComment, getAllComments, deleteBulkComment, editComment, downOrUpvotesComment, likeOrDislikeComment, blockComment, getAllReplies } = require("../services/comments.service");
const constantsUtils = require("../utils/constants.utils");
const { errorResponse, successResponse } = require("../utils/response.utils");
const { gemification, gemificationTotal } = require("../utils/gemification.utils");
const { commentCount } = require("../utils/comment-count.utils");

// Get all comments by pages
exports.getAllComments = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {

        let page = req.query.page ? req.query.page : 0;
        let perPage = req.query.perPage ? req.query.perPage : 10;
        let skipCount = req.query.skip ? req.query.skip : 0;
        let pageName = req.query.pageName;
        let pageId = req.query.pageId;
        let noMoreReplies = false;
        
        const result = await getAllComments(page, perPage, pageName, pageId, skipCount );
        if (result.replies.length < perPage) noMoreReplies = true
        
        result.noMoreReplies = noMoreReplies;
        return res.status(200).json(successResponse(constantsUtils.ALL_COMMENT_LIST, result));

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Create Comment
exports.createComment = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {
        const { comment, comment_by, comment_to, comment_type, page_type, page_id, floatingCommentData } = req.body;

        if (!comment || !comment_by || !page_type || !page_id || !floatingCommentData) return res.status(400).json(errorResponse(constantsUtils.COMMENT_FIELD_MISSING));

        const commentObj = {
            comment,
            comment_by,
            comment_to,
            comment_type,
            page_type,
            page_id,
            floatingCommentData
        }

        const result = await createComment(commentObj);

        // update gemification
        const user = req.user;
        const authToken = req.headers.authorization;
        const tokenParts = authToken.split(' ');
        const tokenValue = tokenParts[1];
        await gemification(user, tokenValue, action = "add");
        gemificationTotal(user, tokenValue);

        commentCount(tokenValue, page_id, page_type);

        return res.status(200).json(successResponse(constantsUtils.CREATE_COMMENT, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message));
    }
};

// Edit Comment
exports.editComment = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {
        const { commentId, userId } = req.params;
        const data = req.body;

        const comment = await getSingleComment(commentId);
        if (!comment) return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT));

        const commentBy = parseInt(comment.comment_by.id);
        const parseUserId = parseInt(userId);

        if (data.comment_by || data.comment_to || data.like_count || data.upvotes || data.downvotes || data.is_blocked) return res.status(400).json(errorResponse(constantsUtils.COMMENT_RESTRICT_FIELDS));

        if (commentBy === parseUserId) {
            const result = await editComment(commentId, data);
            return res.status(200).json(successResponse(constantsUtils.UPDATE_COMMENT, result))
        } else {
            return res.status(400).json(errorResponse(constantsUtils.NOT_AUTHORIZED))
        }
    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }

};

// Delete replies

const deleteReplies = async (id, user, tokenValue) => {
    const comment = await getSingleComment(id);

    if (comment.replies.length > 0) {
        for (const r of comment.replies) {
            await deleteReplies(r._id)
        }
    }

    return comment._id;
}

const fetchSubReplies = async (replies) => {
    let ids = []
    for (const r of replies) {
        const comment = await getSingleComment(r._id)
        if (comment.replies.length > 0) {
            ids = [ ...ids, ...await fetchSubReplies(comment.replies) ]
        }
        ids.push(r._id)
    }
    return ids
}

// Delete Comment
exports.deleteComment = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only.
    try {
        const { commentId, userId } = req.params;
        const comment = await getSingleComment(commentId);
        if (!comment) return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT))

        const commentBy = parseInt(comment.comment_by.id);
        const parseUserId = parseInt(userId);
        if (commentBy === parseUserId) {

            // update gemification
            const user = req.user;
            const authToken = req.headers.authorization;
            const tokenParts = authToken.split(' ');
            const tokenValue = tokenParts[1];
            
            let ids = []
            ids.push(comment._id);
            if (comment.replies.length > 0) {
                let replyIds = await fetchSubReplies(comment.replies)
                ids = [ ...ids, ...replyIds ]
            }

            await deleteBulkComment(ids)
            await gemification(user, tokenValue, "subtract", ids.length);
            gemificationTotal(user, tokenValue);

            return res.status(200).json(successResponse(constantsUtils.DELETE_COMMENT))
        } else {
            return res.status(400).json(errorResponse(constantsUtils.NOT_AUTHORIZED))
        }

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Get Single Comment
exports.getSingleComment = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {
        const { commentId } = req.params;
        const result = await getSingleComment(commentId);

        if (!result) return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT))

        return res.status(200).json(successResponse(constantsUtils.SINGLE_COMMENT, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Send reply
exports.sendReplyToExistingComment = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {
        const { comment, comment_by, page_type,
            page_id, parent_comment_id } = req.body;
        const { commentId } = req.params;

        const existingComment = await getSingleComment(commentId);
        if (!existingComment) return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT));
        if (!comment || !comment_by || !page_type ||
            !page_id) return res.status(400).json(errorResponse(constantsUtils.COMMENT_FIELD_MISSING));

        const commentObj = {
            comment,
            comment_by,
            page_type,
            page_id,
            parent_comment_id
        }

        const result = await createComment(commentObj);

        // update gemification
        const user = req.user;
        const authToken = req.headers.authorization;
        const tokenParts = authToken.split(' ');
        const tokenValue = tokenParts[1];
        await gemification(user, tokenValue, action = "add");
        gemificationTotal(user, tokenValue);

        commentCount(tokenValue, page_id, page_type);

        await sendReplyToExistingComment(commentId, result.id);

        return res.status(200).json(successResponse(constantsUtils.CREATE_COMMENT, result));

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Get all replies
exports.getAllReplies = async (req, res) => {
    try {
        let page = req.query.page ? req.query.page : 0;
        let perPage = req.query.perPage ? req.query.perPage : 100;
        const { parentCommentId } = req.params;

        const result = await getAllReplies(parentCommentId, page, perPage);

        return res.status(200).json(successResponse(constantsUtils.ALL_COMMENT_LIST, result));

    } catch (error) {
        return res.status(400).json(errorResponse(error.message));
    }
}

// Like or Dislike Comment
exports.likeOrDislikeComment = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {
        const { like, dislike } = req.body;
        const { commentId } = req.params;
        const { userId } = req.query;

        let comment = await getSingleComment(commentId);
        let existUser;

        if (!comment) return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT));

        if (like) {
            if (comment.like_count < 1) {
                comment = await likeOrDislikeComment(commentId, userId, like, dislike);
            } else {
                comment.like_count.filter(async (up) => {
                    existUser = up.userId === userId
                })
                if (!existUser) {
                    comment = await likeOrDislikeComment(commentId, userId, like, dislike);
                }
            }
        }
        if (dislike) {
            if (comment.dislike_count < 1) {
                comment = await likeOrDislikeComment(commentId, userId, like, dislike);
            } else {
                comment.dislike_count.filter(async (up) => {
                    existUser = up.userId === userId
                })
                if (!existUser) {
                    comment = await likeOrDislikeComment(commentId, userId, like, dislike);
                }
            }
        }

        return res.status(200).json(successResponse(constantsUtils.UPDATE_COMMENT, comment));
    } catch (error) {
        return res.status(400).json(errorResponse(error.message));
    }
};

// Upvote or Downvote Comment
exports.downOrUpvotesComment = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {
        const { upvotes, downvotes } = req.body;
        const { commentId } = req.params;
        const { userId } = req.query;

        let comment = await getSingleComment(commentId);
        let existUser;
        if (!comment) return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT));

        if (upvotes) {
            if (comment.upvotes < 1) {
                comment = await downOrUpvotesComment(commentId, userId, upvotes, downvotes);
            } else {
                comment.upvotes.filter(async (up) => {
                    existUser = up.userId === userId
                })
                if (!existUser) {
                    comment = await downOrUpvotesComment(commentId, userId, upvotes, downvotes);
                }
            }
        }
        if (downvotes) {
            if (comment.downvotes < 1) {
                comment = await downOrUpvotesComment(commentId, userId, upvotes, downvotes);
            } else {
                comment.downvotes.filter(async (up) => {
                    existUser = up.userId === userId
                })
                if (!existUser) {
                    comment = await downOrUpvotesComment(commentId, userId, upvotes, downvotes);
                }
            }

        }

        return res.status(200).json(successResponse(constantsUtils.UPDATE_COMMENT, comment));
    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Block comments
exports.blockComment = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {
        const { is_blocked } = req.body;
        const { commentId } = req.params;

        const comment = await getSingleComment(commentId);

        if (!comment) return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT));

        const result = await blockComment(commentId, is_blocked);

        return res.status(200).json(successResponse(constantsUtils.UPDATE_COMMENT, result));
    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};
