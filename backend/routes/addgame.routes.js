const express = require('express');
const router = express.Router();
const GameController = require('../controllers/addgame.controller');

router.post('/GameRegister', GameController.RegisterGame);
router.get('/UserGames/:userEmail', GameController.GetUserGames);
router.get('/GetGamesByEmail', GameController.GetGamesByEmail);

module.exports = router;