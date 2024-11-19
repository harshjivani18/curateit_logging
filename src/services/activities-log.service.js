const Activitylog = require("../models/activities-log.model");

exports.createActivitylog = async (data) => {
    return await Activitylog.create(data);
}

exports.getAllActivitylog = async (page, perPage, userId) => {
    const [activities, totalCount] = await Promise.all([
        Activitylog.find({
            "author.id": parseInt(userId)
        }).limit(perPage).skip(page * perPage).sort({ createdAt: -1 }),
        Activitylog.find({ "author.id": parseInt(userId) }).count()
    ])
    return { activities, totalCount}
}

exports.getActivitylogById = async (id) => {
    return await Activitylog.findById({ _id: id })
}

exports.deleteActivitylog = async (id) => {
    return await Activitylog.findByIdAndDelete(id)
}

exports.deleteAllActivitylog = async () => {
    return await Activitylog.deleteMany()
}

exports.updateActivitylog = async (id, data) => {
    return await Activitylog.findByIdAndUpdate(id, { $set: data })
}