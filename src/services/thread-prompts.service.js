const AIResModel = require("../models/thread-prompts.model");

// Get all comments by pages
exports.getAllAIResService = async (skipCount, perPage, userId) => {
    const [AIRes, totalCount] = await Promise.all([
        AIResModel.find({ 'user.id': parseInt(userId) }).limit(perPage).skip(skipCount),
        AIResModel.find({ 'user.id': parseInt(userId) }).count()
    ])
    return { AIRes, totalCount };
};

// Create AIResModel
exports.createAIResService = async (data) => {
    return await AIResModel.create(data);
};

// // Edit AIResModel
// exports.editComment = async (id, data) => {
//     return await AIResModel.findByIdAndUpdate(id, { $set: data });
// };

// Delete AIResModel
exports.deleteAIResService = async (id) => {
    return await AIResModel.findByIdAndDelete(id);
};

// Get Single AIResModel
exports.getSingleAIResService = async (id) => {
    return await AIResModel.findById({ _id: id });
};
