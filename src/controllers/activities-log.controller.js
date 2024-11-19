const { createActivitylog, getAllActivitylog, getActivitylogById, updateActivitylog, deleteActivitylog, deleteAllActivitylog } = require("../services/activities-log.service");
const constantsUtils = require("../utils/constants.utils");
const { errorResponse, successResponse } = require("../utils/response.utils");

exports.createActivitylog = async (req, res) => {
    try {
        const data = req.body;

        if (!data.action || !data.module || !data.actionType || !data.author) return res.status(400).json(errorResponse(constantsUtils.ACTIVITYLOG_FIELD_MISSING))

        const result = await createActivitylog(data);

        return res.status(200).json(successResponse(constantsUtils.CREATE_ACTIVITYLOG, result))

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.getAllActivitylog = async (req, res) => {
    try {
        let page = req.query.page ? req.query.page : 0;
        let perPage = req.query.perPage ? req.query.perPage : 10;
        const { userId } = req.params;

        const result = await getAllActivitylog(page, perPage, userId);

        return res.status(200).json(successResponse(constantsUtils.ALL_ACTIVITYLOG_LIST, result));

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.getActivitylogById = async (req, res) => {
    try {
        const { activityId } = req.params;
        const result = await getActivitylogById(activityId);

        if (!result) return res.status(400).json(errorResponse(constantsUtils.NO_ACTIVITYLOG))

        return res.status(200).json(successResponse(constantsUtils.SINGLE_ACTIVITYLOG, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.deleteActivitylog = async (req, res) => {
    try {
        const { activityId } = req.params;
        const activitylog = await getActivitylogById(activityId);

        if (!activitylog) return res.status(400).json(errorResponse(constantsUtils.NO_ACTIVITYLOG))

        const result = await deleteActivitylog(activityId);

        return res.status(200).json(successResponse(constantsUtils.DELETE_ACTIVITYLOG))

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.deleteAllActivitylog = async (req, res) => {
    try {

        const result = await deleteAllActivitylog();

        return res.status(200).json(successResponse(constantsUtils.DELETE_ALL_ACTIVITYLOG))

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.updateActivitylog = async (req, res) => {
    try {
        const data = req.body;
        const { activityId } = req.params;
        const activitylog = await getActivitylogById(activityId);

        if (!activitylog) return res.status(400).json(errorResponse(constantsUtils.NO_ACTIVITYLOG))

        const result = await updateActivitylog(activityId, data);

        return res.status(200).json(successResponse(constantsUtils.UPDATE_ACTIVITYLOG, result))

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}