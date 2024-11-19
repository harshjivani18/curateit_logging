// Using libraries
const express               = require('express');
const routes                = express.Router();

// TODO: Need to add middleware to verfiy that particular token middlewares
const { verifyToken } = require('../middlewares/auth.middleware');

// controller
const ThreadController    = require('../controllers/thread.controller');

// // routes.patch('/:gemId/user/:userId', verifyToken, AIResController.editPrompt);

routes.delete('/:threadId/user/:userId', verifyToken, ThreadController.deleteThread);

routes.post("/default-thread", verifyToken, ThreadController.createDefaultThread);
routes.post("/", verifyToken, ThreadController.createThread);

routes.get("/user/:userId", ThreadController.getAllThreads);
routes.get("/:threadId", verifyToken, ThreadController.getSingleThread);

module.exports = routes;