const Prompt = require("../models/prompts.model")

// Get all Prompts
exports.getAllPromptService = async (skipCount, perPage, userId) => {
    const [prompts, totalCount] = await Promise.all([
        Prompt.find({ 'user.id': parseInt(userId) }).limit(perPage).skip(skipCount),
        Prompt.find({ 'user.id': parseInt(userId) }).count()
    ])
    return { prompts, totalCount };
};

// Create Prompt
exports.createPromptService = async (data) => {
    return await Prompt.create(data);
};

// Edit Prompt
exports.editPromptService = async (id, data) => {
    return await Prompt.findByIdAndUpdate(id, { $set: data });
};

// Delete Prompt
exports.deleteComment = async (id) => {
    return await Prompt.findByIdAndDelete(id);
};

// Get Single Prompt
exports.getSinglePromptService = async (id) => {
    // return await Prompt.findOne({ "gem.id": parseInt(id) });
    return await Prompt.findOne({_id: id});
};

// Get Admin Prompts
exports.getAdminPromptsService = async (skipCount, perPage) => {
    const [prompts, totalCount] = await Promise.all([
        Prompt.find({ share_type: "Public", prompt_type: "Admin"}).limit(perPage).skip(skipCount),
        Prompt.find({ share_type: "Public", prompt_type: "Admin"}).count()
    ])
    return { prompts, totalCount };
};

// search all Prompts
exports.searchPromptService = async (skipCount, perPage, userId, query) => {
    const [prompts, totalCount] = await Promise.all([
        // Prompt.find({ $or: [{'user.id': parseInt(userId)}, {'prompt_type': 'Admin'}], "$text": { "$search": query } }).limit(perPage).skip(skipCount),

        Prompt.find({ $and: [ { $or: [ { 'user.id': parseInt(userId) }, { 'prompt_type': 'Admin' }]}, {
            $or: [
              { 'name': { $regex: query, $options: 'i' } }, // Case-insensitive regex search for 'name'
              { 'prompt': { $regex: query, $options: 'i' } } // Case-insensitive regex search for 'prompt'
            ]
          }]}).limit(perPage).skip(skipCount),

        Prompt.find({ 'user.id': parseInt(userId) }).count()
    ])
    return { prompts, totalCount };
};