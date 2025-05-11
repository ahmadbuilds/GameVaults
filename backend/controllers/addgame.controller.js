const AddGameModel = require('../models/addgame.model');
const { RegisterGame } = require('../services/addgame.service');

module.exports.RegisterGame = async(req, res) => {
    try {
        const {title, notes, status, priority, format, platform, region, userEmail} = req.body;

        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }

        const game = await RegisterGame({
            title,
            notes,
            status,
            priority,
            format,
            platform,
            region,
            userEmail
        });

        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.GetUserGames = async(req, res) => {
    try {
        const { userEmail } = req.params;
        
        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }

        const games = await AddGameModel.find({ userEmail }).sort({ createdAt: -1 });
        res.status(200).json(games);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.GetGamesByEmail = async(req, res) => {
    try {
       
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ error: 'Email parameter is required' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const games = await AddGameModel.find({ userEmail: email.toLowerCase() }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        console.error('Error fetching games by email:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};