const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/collection.controller');

// Collection CRUD routes
router.post('/CreateCollection/:userEmail', CollectionController.createCollection);
router.get('/GetCollection/:collectionId', CollectionController.getCollectionById);
router.get('/UserCollections/:userEmail', CollectionController.getUserCollections);
router.get('/PublicCollections', CollectionController.getPublicCollections);
router.put('/UpdateCollection/:collectionId/:userEmail', CollectionController.updateCollection);
router.delete('/DeleteCollection/:collectionId/:userEmail', CollectionController.deleteCollection);

// Game management within collections
router.post('/AddGameToCollection/:collectionId/:userEmail', CollectionController.addGameToCollection);
router.delete('/RemoveGameFromCollection/:collectionId/:gameId/:userEmail', CollectionController.removeGameFromCollection);
router.get('/AvailableGames/:userEmail', CollectionController.getAvailableGames);


router.post('/api/collections/AddGameToCollection/:collectionId/:userEmail', CollectionController.addGameToCollection);

// Media management routes
router.post('/AddMedia/:collectionId/:userEmail', CollectionController.addMediaToCollection);
router.delete('/RemoveMedia/:collectionId/:userEmail/:mediaPublicId', CollectionController.removeMediaFromCollection);

// Social features
router.post('/ToggleLike/:collectionId', CollectionController.toggleLike);

// Search
router.get('/SearchCollections', CollectionController.searchCollections);

module.exports = router;