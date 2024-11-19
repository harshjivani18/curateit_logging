const { getAllAIResService, createAIResService, deleteAIResService, getSingleAIResService } = require("../services/thread-prompts.service");
const { createDefaultThreadService } = require("../services/thread.service");
const constantsUtils = require("../utils/constants.utils");
const { openai } = require("../utils/openai-utils");
const { errorResponse, successResponse } = require("../utils/response.utils");

// Get all ai response by pages
exports.getAllAIRes = async (req, res) => {
    try {
        const { userId } = req.params;
        let page = req.query.page ? req.query.page : 0;
        let perPage = req.query.perPage ? req.query.perPage : 10;
        const skipCount = page * perPage;

        const result = await getAllAIResService(skipCount, perPage, userId);

        return res
            .status(200)
            .json(successResponse(constantsUtils.ALL_AI_LIST, result));

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Create Comment
exports.createAIRes = async (req, res) => {
    try {
        const { prompt, content, user, gems } = req.body;

        if (!prompt || !content || !gems || !user)
            return res
                .status(400)
                .json(errorResponse(constantsUtils.AI_FIELD_MISSING));

        const data = {
            prompt,
            content
        }
        const ai_response = await openai(data)
        const AIResObj = {
            prompt,
            content,
            ai_response,
            gems,
            user,
        };

        const result = await createAIResService(AIResObj);

        createDefaultThreadService(result.id, result.user)
        return res.status(200).json(successResponse(constantsUtils.CREATE_AI, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message));
    }
};

// // Edit Comment
// exports.editComment = async (req, res) => {
//     // TODO: Just service call and return response here all logic will manage in services only
//     try {
//         const { commentId, userId } = req.params;
//         const data = req.body;

//         const comment = await getSingleComment(commentId);
//         if (!comment) return res.status(400).json(errorResponse(constantsUtils.NO_COMMENT));

//         const commentBy = parseInt(comment.comment_by.id);
//         const parseUserId = parseInt(userId);

//         if (data.comment_by || data.comment_to || data.like_count || data.upvotes || data.downvotes || data.is_blocked) return res.status(400).json(errorResponse(constantsUtils.COMMENT_RESTRICT_FIELDS));

//         if (commentBy === parseUserId) {
//             const result = await editComment(commentId, data);
//             return res.status(200).json(successResponse(constantsUtils.UPDATE_COMMENT, result))
//         } else {
//             return res.status(400).json(errorResponse(constantsUtils.NOT_AUTHORIZED))
//         }
//     } catch (error) {
//         return res.status(400).json(errorResponse(error.message))
//     }

// };

// Delete Comment
exports.deleteAIRes = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only.
    try {
        const { aiResId, userId } = req.params;
        const AIRes = await getSingleAIResService(aiResId);
        if (!AIRes) return res.status(400).json(errorResponse(constantsUtils.NO_AI))

        const AIResBy = parseInt(AIRes.user.id);
        const parseUserId = parseInt(userId);
        if (AIResBy === parseUserId) {
            await deleteAIResService(aiResId);
            return res.status(200).json(successResponse(constantsUtils.DELETE_AI))
        } else {
            return res.status(400).json(errorResponse(constantsUtils.NOT_AUTHORIZED))
        }

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Get Single Comment
exports.getSingleAIRes = async (req, res) => {
    // TODO: Just service call and return response here all logic will manage in services only
    try {
        const { aiResId } = req.params;
        const result = await getSingleAIResService(aiResId);

        if (!result) return res.status(400).json(errorResponse(constantsUtils.NO_AI))

        return res.status(200).json(successResponse(constantsUtils.SINGLE_AI, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};
