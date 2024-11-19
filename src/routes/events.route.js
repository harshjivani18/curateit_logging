const express = require("express");
const routes = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');

const eventController    = require('../controllers/events.controller');

routes.patch('/:eventId', verifyToken, eventController.updateEvent);

routes.delete('/:eventId', verifyToken, eventController.deleteEvent);
routes.delete("/", verifyToken, eventController.deleteAllEvents);

routes.post("/", verifyToken, eventController.createEvents);

routes.get("/:eventId", verifyToken, eventController.getEventById);
routes.get("", verifyToken, eventController.getAllEvents);


module.exports = routes; 