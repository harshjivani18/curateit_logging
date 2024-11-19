const express = require("express");
const routes = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');

const activitylogController    = require('../controllers/activities-log.controller');

routes.patch('/:activityId', verifyToken, activitylogController.updateActivitylog);

routes.delete('/:activityId', verifyToken, activitylogController.deleteActivitylog);
routes.delete("/", verifyToken, activitylogController.deleteAllActivitylog);

routes.post("/", verifyToken, activitylogController.createActivitylog);

routes.get("/:activityId", verifyToken, activitylogController.getActivitylogById);
routes.get("/all/:userId", verifyToken, activitylogController.getAllActivitylog);


module.exports = routes; 