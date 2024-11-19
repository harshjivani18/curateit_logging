// Using libraries
const express               = require('express');
const routes                = express.Router();

// TODO: Need to add middleware to verfiy that particular token middlewares
const { verifyToken } = require('../middlewares/auth.middleware');

// controller
const promptsController    = require('../controllers/prompts.controller');

routes.patch('/:promptId', verifyToken, promptsController.editPrompt);

// routes.delete('/:commentId/:userId', verifyToken, promptsController.deleteComment);

routes.post("/", verifyToken, promptsController.createPrompt);

routes.get("/admin", verifyToken, promptsController.getAdminPrompts);
routes.get("/search", verifyToken, promptsController.searchPrompt);
routes.get("/:id", verifyToken, promptsController.getSinglePrompt);
routes.get("/", verifyToken, promptsController.getAllPrompt);



module.exports = routes;