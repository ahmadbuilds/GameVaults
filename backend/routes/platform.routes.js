const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platform.controller');

// Route to add a new platform
router.post('/', platformController.addPlatform);

// Route to get platforms by email 
router.get('/email', platformController.getPlatformsByEmail);

// Route to update platform's gamesCount by name
router.patch('/update-count/:name/:email', platformController.updateGameCountByName);

router.get('/search', platformController.searchPlatformsByName);

// Route to get a single platform by ID
router.get('/:id', platformController.getPlatformById);

// Route to update a platform
router.put('/:id', platformController.updatePlatform);

// Route to delete a platform
router.delete('/:id', platformController.deletePlatform);



module.exports = router;