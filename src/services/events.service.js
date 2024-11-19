const Event = require("../models/events.model");

exports.createEvents = async (data) => {
    return await Event.create(data);
}

exports.getAllEvents = async (page, perPage) => {
    return await Event.find().limit(perPage).skip(page * perPage)
}

exports.getEventById = async (id) => {
    return await Event.findById({_id: id})
}

exports.deleteEvent = async (id) => {
    return await Event.findByIdAndDelete(id)
}

exports.deleteAllEvents = async () => {
    return await Event.deleteMany()
}

exports.updateEvent = async (id, data) => {
    return await Event.findByIdAndUpdate(id, {$set: data})
}