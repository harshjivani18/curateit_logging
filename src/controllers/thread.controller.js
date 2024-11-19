const { getSingleThreadService, createDefaultThreadService, getAllThreadsService, createThreadService, deleteThreadService } = require("../services/thread.service");
const constantsUtils = require("../utils/constants.utils");
const { errorResponse, successResponse } = require("../utils/response.utils");

// Get all Threads response by pages
exports.getAllThreads = async (req, res) => {
    try {
        const { userId } = req.params;
        let page = req.query.page ? req.query.page : 0;
        let perPage = req.query.perPage ? req.query.perPage : 10;
        const skipCount = page * perPage;

        const result = await getAllThreadsService(skipCount, perPage, userId);

        return res
            .status(200)
            .json(successResponse(constantsUtils.ALL_THREAD_LIST, result));

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Create Default Thread
exports.createDefaultThread = async (req, res) => {
    try {
        const { user } = req.body;
        if (!user)
            return res
                .status(400)
                .json(errorResponse(constantsUtils.THREAD_FIELD_MISSING));

        const result = await createDefaultThreadService(null, user);
        return res.status(200).json(successResponse(constantsUtils.CREATE_THREAD, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message));
    }
};

// Create Thread
exports.createThread = async (req, res) => {
    try {
        const { user } = req.body;
        if (!user)
            return res
                .status(400)
                .json(errorResponse(constantsUtils.THREAD_FIELD_MISSING));

        const data = {
            user
        }
        const result = await createThreadService(data);
        return res.status(200).json(successResponse(constantsUtils.CREATE_THREAD, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message));
    }
};

// Delete Thread
exports.deleteThread = async (req, res) => {
    try {
        const { threadId, userId } = req.params;
        const thread = await getSingleThreadService(threadId);
        if (!thread) return res.status(400).json(errorResponse(constantsUtils.NO_THREAD))

        const threadBy = parseInt(thread.user.id);
        const parseUserId = parseInt(userId);
        if (threadBy === parseUserId) {
            await deleteThreadService(threadId);
            return res.status(200).json(successResponse(constantsUtils.DELETE_THREAD))
        } else {
            return res.status(400).json(errorResponse(constantsUtils.NOT_AUTHORIZED))
        }

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};

// Get Single Thread
exports.getSingleThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const result = await getSingleThreadService(threadId);

        if (!result) return res.status(400).json(errorResponse(constantsUtils.NO_THREAD))

        return res.status(200).json(successResponse(constantsUtils.SINGLE_THREAD, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
};