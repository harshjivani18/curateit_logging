// Using libraries
const express               = require('express');
const routes                = express.Router();

// TODO: Need to add middleware to verfiy that particular token middlewares
const { verifyToken }       = require('../middlewares/auth.middleware');

// controller
const searchController     = require('../controllers/searches.controller');

routes.patch('/:searchId', verifyToken, searchController.updateSearchCb);
// routes.delete('/:commentId/:userId', verifyToken, searchController.deleteComment);
routes.delete('/:searchId', verifyToken, searchController.deleteSearchCb);
routes.delete('/bulk-delete', verifyToken, searchController.deleteBulkSearchCb);
routes.post("/bulk-create", verifyToken, searchController.createBulkSearchCb);
routes.post("/", verifyToken, searchController.createSearchCb);

routes.get("/search-results", verifyToken, searchController.searchCb);
routes.get("/filter-results", verifyToken, searchController.filterCb);

module.exports = routes;