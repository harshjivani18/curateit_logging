// Using libraries
const express               = require('express');
const routes                = express.Router();

// controller
const commonController    = require('../controllers/common.controller');

routes.get("/social-scraping", commonController.socialScrapping);

module.exports = routes;