
const { createEvents, getAllEvents, getEventById, deleteEvent, deleteAllEvents, updateEvent } = require("../services/events.service");
const constantsUtils = require("../utils/constants.utils");
const { errorResponse, successResponse } = require("../utils/response.utils");

exports.createEvents = async (req, res) => {
    try {
        const data = req.body;

        if (!data.event_type || !data.event || !data.module) return res.status(400).json(errorResponse(constantsUtils.EVENT_FIELD_MISSING))

        const result = await createEvents(data);

        return res.status(200).json(successResponse(constantsUtils.CREATE_EVENT, result))

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.getAllEvents = async (req, res) => {
    try {
        let page = req.query.page ? req.query.page : 0;
        let perPage = req.query.perPage ? req.query.perPage : 10;

        const result = await getAllEvents(page, perPage);

        return res.status(200).json(successResponse(constantsUtils.ALL_EVENT_LIST, result));

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;
        const result = await getEventById(eventId);

        if (!result) return res.status(400).json(errorResponse(constantsUtils.NO_EVENT))

        return res.status(200).json(successResponse(constantsUtils.SINGLE_EVENT, result))
    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await getEventById(eventId);

        if (!event) return res.status(400).json(errorResponse(constantsUtils.NO_EVENT))

        const result = await deleteEvent(eventId);

        return res.status(200).json(successResponse(constantsUtils.DELETE_EVENT))

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.deleteAllEvents = async (req, res) => {
    try {

        const result = await deleteAllEvents();

        return res.status(200).json(successResponse(constantsUtils.DELETE_ALL_EVENT))

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const data = req.body;
        const { eventId } = req.params;
        const event = await getEventById(eventId);

        if (!event) return res.status(400).json(errorResponse(constantsUtils.NO_EVENT))

        const result = await updateEvent(eventId, data);

        return res.status(200).json(successResponse(constantsUtils.UPDATE_EVENT, result))

    } catch (error) {
        return res.status(400).json(errorResponse(error.message))
    }
}