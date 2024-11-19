const thread = require("../models/thread.model");

// Get all comments by pages
exports.getAllThreadsService = async (skipCount, perPage, userId) => {
    const [threads, totalCount] = await Promise.all([
        thread.find({ 'user.id': parseInt(userId) }).limit(perPage).skip(skipCount).sort({createdAt: -1}),
        thread.find({ 'user.id': parseInt(userId) }).count()
    ])
    return { threads, totalCount };
};

// Create Default Thread
exports.createDefaultThreadService = async (pid, user) => {
    const existThread = await thread.find({ 'user.id': parseInt(user.id) }).sort({createdAt: 1});
    if(existThread && existThread.length > 0) {
        const data = {
            prompts: [...existThread[0].prompts, pid],
            user: {
                id: user.id,
                username: user.username
            }
        }
        return await thread.findByIdAndUpdate(existThread[0]._id, { $set: data })
        
    }

    const data = {
        prompts: pid ? [pid] : [],
        user:  {
            id: user.id,
            username: user.username
        }
    }
    return await thread.create(data);
    
};

// Create Thread
exports.createThreadService = async (data) => {
    return await thread.create(data); 
}

// // Edit AIResModel
// exports.editComment = async (id, data) => {
//     return await AIResModel.findByIdAndUpdate(id, { $set: data });
// };

// Delete AIResModel
exports.deleteThreadService = async (id) => {
    return await thread.findByIdAndDelete(id);
};

// Get Single AIResModel
exports.getSingleThreadService = async (id) => {
    return await thread.findById({ _id: id });
};
