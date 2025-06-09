const GameService = require('../services/addgame.service');

module.exports = {
    RegisterGame: async (req, res) => {
        try {
            const {
                title,
                platform,
                status,
                progress = 0,
                hoursPlayed = 0,
                description = '',
                developer = '',
                publisher = '',
                releaseDate = new Date(),
                genres = [],
                rating = 3,
                playMode = ['Single-player'],
                personalNotes = '',
                owned = true,
                userEmail,
                imageUrl = '',
                videoUrl = '',
                mediaUrls = []
            } = req.body;

            if (!userEmail) {
                return res.status(400).json({ error: 'User email is required' });
            }

            const game = await GameService.RegisterGame({
                title,
                platform,
                status,
                progress,
                hoursPlayed,
                description,
                developer,
                publisher,
                releaseDate,
                genres,
                playMode,
                personalNotes,
                owned,
                userEmail,
                imageUrl,
                videoUrl,
                rating,
                mediaUrls
            });

            res.status(201).json(game);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    GetUserGames: async (req, res) => {
        try {
            const { userEmail } = req.params;
            
            if (!userEmail) {
                return res.status(400).json({ error: 'User email is required' });
            }

            const games = await GameService.GetUserGames(userEmail);
            res.status(200).json(games);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    GetGamesByEmail: async (req, res) => {
        try {
            const { email } = req.query;
            
            if (!email) {
                return res.status(400).json({ error: 'Email parameter is required' });
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            const games = await GameService.GetUserGames(email.toLowerCase());
            
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
    },

    UpdateGame: async (req, res) => {
        try {
            const { title, userEmail } = req.params;
            const updateData = req.body;

            if (!title || !userEmail) {
                return res.status(400).json({ error: 'Title and user email are required' });
            }

            const updatedGame = await GameService.UpdateGame(title, userEmail, updateData);
            res.status(200).json(updatedGame);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    AddMediaToGame: async (req, res) => {
        try {
            const { gameId, userEmail } = req.params;
            const mediaData = req.body;

            if (!gameId || !userEmail) {
                return res.status(400).json({ error: 'Game ID and user email are required' });
            }

            const updatedGame = await GameService.AddMediaToGame(gameId, userEmail, mediaData);
            res.status(200).json(updatedGame);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    RemoveMediaFromGame: async (req, res) => {
        try {
            const { gameId, userEmail, mediaPublicId } = req.params;

            if (!gameId || !userEmail || !mediaPublicId) {
                return res.status(400).json({ error: 'Game ID, user email, and media public ID are required' });
            }

            const updatedGame = await GameService.RemoveMediaFromGame(gameId, userEmail, mediaPublicId);
            res.status(200).json(updatedGame);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    DeleteGame: async (req, res) => {
        try {
            const { gameId, userEmail } = req.params;

            if (!gameId || !userEmail) {
                return res.status(400).json({ 
                    success: false,
                    error: 'Game ID and user email are required' 
                });
            }

            const result = await GameService.DeleteGame(gameId, userEmail);
            
            res.status(200).json({
                success: true,
                message: result.message,
                deletionErrors: result.deletionErrors
            });
        } catch (error) {
            console.error('Error in DeleteGame controller:', error);
            res.status(400).json({ 
                success: false,
                error: error.message 
            });
        }
    }
};