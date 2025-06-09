const AddGame = require('../models/addgame.model');
const cloudinary = require('cloudinary').v2;

module.exports = {
    RegisterGame: async ({
        title,
        platform,
        status,
        progress = 0,
        hoursPlayed = 0,
        rating = 3,
        description = '',
        developer = '',
        publisher = '',
        releaseDate = new Date(),
        genres = [],
        playMode = ['Single-player'],
        personalNotes = '',
        owned = true,
        userEmail,
        imageUrl = '',
        videoUrl = '',
        mediaUrls = [] // New field for multiple media URLs
    }) => {
        if (!title || !platform || !status || !userEmail) {
            throw new Error("Title, platform, status, and user email are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            throw new Error("Invalid email format");
        }

        const existingGame = await AddGame.findOne({ title, userEmail });
        if (existingGame) {
            throw new Error("A game with this title already exists in your library");
        }

        if (progress < 0 || progress > 100) {
            throw new Error("Progress must be between 0 and 100");
        }

        if (hoursPlayed < 0) {
            throw new Error("Hours played must be greater than 0");
        }

        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        const NewGame = await AddGame.create({
            title,
            platform,
            status,
            progress,
            hoursPlayed,
            rating,
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
            mediaUrls
        });

        return NewGame;
    },

    GetUserGames: async (userEmail) => {
        if (!userEmail) {
            throw new Error("User email is required");
        }

        return await AddGame.find({ userEmail }).sort({ createdAt: -1 });
    },

    UpdateGame: async (title, userEmail, updateData) => {
        if (!title || !userEmail) {
            throw new Error("Title and user email are required");
        }

        if (updateData.progress !== undefined && (updateData.progress < 0 || updateData.progress > 100)) {
            throw new Error("Progress must be between 0 and 100");
        }

        if (updateData.hoursPlayed !== undefined && updateData.hoursPlayed < 0) {
            throw new Error("Hours played must be greater than 0");
        }

        if (updateData.rating !== undefined && (updateData.rating < 1 || updateData.rating > 5)) {
            throw new Error("Rating must be between 1 and 5");
        }

        const updatedGame = await AddGame.findOneAndUpdate(
            { title, userEmail },
            updateData,
            { new: true }
        );

        if (!updatedGame) {
            throw new Error("Game not found");
        }

        return updatedGame;
    },

    // New method to add media to existing game
    AddMediaToGame: async (gameId, userEmail, mediaData) => {
        if (!gameId || !userEmail) {
            throw new Error("Game ID and user email are required");
        }

        const game = await AddGame.findOne({ _id: gameId, userEmail });
        if (!game) {
            throw new Error("Game not found");
        }

        // Initialize mediaUrls array if it doesn't exist
        if (!game.mediaUrls) {
            game.mediaUrls = [];
        }

        // Add new media
        game.mediaUrls.push({
            url: mediaData.url,
            type: mediaData.type, // 'image' or 'video'
            publicId: mediaData.publicId,
            caption: mediaData.caption || '',
            uploadedAt: new Date()
        });

        await game.save();
        return game;
    },

    // Method to remove media from game
    RemoveMediaFromGame: async (gameId, userEmail, mediaPublicId) => {
        if (!gameId || !userEmail || !mediaPublicId) {
            throw new Error("Game ID, user email, and media public ID are required");
        }

        const game = await AddGame.findOne({ _id: gameId, userEmail });
        if (!game) {
            throw new Error("Game not found");
        }

        // Remove media from array
        game.mediaUrls = game.mediaUrls.filter(media => media.publicId !== mediaPublicId);
        
        await game.save();
        return game;
    },

    // Helper function to extract public ID from Cloudinary URL
    extractPublicIdFromUrl: (url) => {
        if (!url || typeof url !== 'string') return null;
        
        try {
            // Handle different Cloudinary URL formats
            const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
            return match ? match[1] : null;
        } catch (error) {
            console.error('Error extracting public ID from URL:', error);
            return null;
        }
    },

    // Method to delete game and all associated media from Cloudinary
    DeleteGame: async (gameId, userEmail) => {
        if (!gameId || !userEmail) {
            throw new Error("Game ID and user email are required");
        }

        const game = await AddGame.findOne({ _id: gameId, userEmail });
        if (!game) {
            throw new Error("Game not found");
        }

        const deletionErrors = [];

        try {
            // Collect all media public IDs for deletion
            const mediaToDelete = [];

            // Add main image URL if exists
            if (game.imageUrl) {
                const publicId = module.exports.extractPublicIdFromUrl(game.imageUrl);
                if (publicId) {
                    mediaToDelete.push(publicId);
                }
            }

            // Add main video URL if exists
            if (game.videoUrl) {
                const publicId = module.exports.extractPublicIdFromUrl(game.videoUrl);
                if (publicId) {
                    mediaToDelete.push(publicId);
                }
            }

            // Add all media from mediaUrls array
            if (game.mediaUrls && Array.isArray(game.mediaUrls)) {
                game.mediaUrls.forEach(media => {
                    if (media.publicId && media.publicId !== 'fallback') {
                        mediaToDelete.push(media.publicId);
                    }
                });
            }

            // Delete media from Cloudinary
            const cloudinaryDeletions = mediaToDelete.map(async (publicId) => {
                try {
                    // Try to delete as image first, then as video
                    let result = await cloudinary.uploader.destroy(publicId);
                    
                    // If image deletion failed, try as video
                    if (result.result === 'not found') {
                        result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                    }
                    
                    if (result.result !== 'ok' && result.result !== 'not found') {
                        console.warn(`Failed to delete media with publicId: ${publicId}`, result);
                        deletionErrors.push(`Failed to delete media: ${publicId}`);
                    }
                } catch (error) {
                    console.error(`Error deleting media with publicId: ${publicId}`, error);
                    deletionErrors.push(`Error deleting media: ${publicId} - ${error.message}`);
                }
            });

            // Wait for all Cloudinary deletions to complete
            await Promise.all(cloudinaryDeletions);

            // Delete the game from database
            await AddGame.findByIdAndDelete(gameId);

            return {
                success: true,
                message: 'Game deleted successfully',
                deletionErrors: deletionErrors.length > 0 ? deletionErrors : null
            };

        } catch (error) {
            console.error('Error deleting game:', error);
            throw new Error(`Failed to delete game: ${error.message}`);
        }
    }
};