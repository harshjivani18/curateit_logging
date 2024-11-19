
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    const requestId = new mongoose.Types.ObjectId();
    res.logger      = console.child({
        url: req.url,
        requestStartTime: Date.now(),
    });
    req.id          = requestId;
    res.logger.info('Request started');
    next();
};