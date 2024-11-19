// Using libraries
const express               = require('express');
const routes                = express.Router();

// TODO: Need to add middleware to verfiy that particular token middlewares
const { verifyToken } = require('../middlewares/auth.middleware');

// controller
const AIResController    = require('../controllers/thread-prompts.controller');

// routes.patch('/:gemId/user/:userId', verifyToken, AIResController.editPrompt);

routes.delete('/:aiResId/user/:userId', verifyToken, AIResController.deleteAIRes);

routes.post("/", verifyToken, AIResController.createAIRes);

routes.get("/user/:userId", verifyToken, AIResController.getAllAIRes);
routes.get("/:aiResId", verifyToken, AIResController.getSingleAIRes);

module.exports = routes;