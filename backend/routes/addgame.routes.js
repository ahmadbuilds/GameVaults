const express = require('express');
const router = express.Router();
const GameController = require('../controllers/addgame.controller');

router.post('/GameRegister', GameController.RegisterGame);
router.get('/UserGames/:userEmail', GameController.GetUserGames);
router.get('/GetGamesByEmail', GameController.GetGamesByEmail);
router.put('/UpdateGame/:title/:userEmail', GameController.UpdateGame);


// Media management routes
router.post('/AddMedia/:gameId/:userEmail', GameController.AddMediaToGame);
router.delete('/RemoveMedia/:gameId/:userEmail/:mediaPublicId', GameController.RemoveMediaFromGame);

// Delete game route
router.delete('/DeleteGame/:gameId/:userEmail', GameController.DeleteGame);

module.exports = router;