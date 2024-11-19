// Using libraries
const express               = require('express');
const routes                = express.Router();

// TODO: Need to add middleware to verfiy that particular token middlewares
const { verifyToken } = require('../middlewares/auth.middleware');

// controller
const commentsController    = require('../controllers/comments.controller');

routes.patch('/upvotes-downvotes-comment/:commentId', verifyToken, commentsController.downOrUpvotesComment);
routes.patch('/like-dislike-comment/:commentId', verifyToken, commentsController.likeOrDislikeComment);
routes.patch('/block-comment/:commentId', verifyToken, commentsController.blockComment);
routes.patch('/:commentId/:userId', verifyToken, commentsController.editComment);

routes.delete('/:commentId/:userId', verifyToken, commentsController.deleteComment);

routes.post("/reply-to/:commentId", verifyToken, commentsController.sendReplyToExistingComment);
routes.post("/", verifyToken, commentsController.createComment);

routes.get('/:commentId', commentsController.getSingleComment);
routes.get('/replies/:parentCommentId', commentsController.getAllReplies);
routes.get("/", commentsController.getAllComments);

module.exports = routes;