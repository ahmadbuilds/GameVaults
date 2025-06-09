const Platform = require('../models/platform.model');


class PlatformService {
    // Add a new platform
    async addPlatform(platformData) {
        try {
            const platform = new Platform(platformData);
            const savedPlatform = await platform.save();
            return savedPlatform;
        } catch (error) {
            throw error;
        }
    }

    // Get platforms by email
    async getPlatformsByEmail(email) {
        try {
            const platforms = await Platform.find({ email });
            return platforms;
        } catch (error) {
            throw error;
        }
    }
    
    // Update platform's gamesCount by name
    async updateGameCountByName(name, email) {
        try {
           
            const updatedPlatform = await Platform.findOneAndUpdate(
                { name, email },  
                { $inc: { gamesCount: 1 } }, 
                { new: true, upsert: true }  
            );
            return updatedPlatform;
        } catch (error) {
            throw error;
        }
    }

    // Get a single platform by ID
    async getPlatformById(id) {
        try {
            const platform = await Platform.findById(id);
            return platform;
        } catch (error) {
            throw error;
        }
    }

    // Update a platform
    async updatePlatform(id, updateData) {
        try {
            const updatedPlatform = await Platform.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
            return updatedPlatform;
        } catch (error) {
            throw error;
        }
    }

    async searchPlatformsByName(email, nameQuery) {
    try {
        const platforms = await Platform.find({ 
            email,
            name: { $regex: nameQuery, $options: 'i' }
        });
            return platforms;
        } catch (error) {
            throw error;
        }
    }

    // Delete a platform
    async deletePlatform(id) {
        try {
            const deletedPlatform = await Platform.findByIdAndDelete(id);
            return deletedPlatform;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PlatformService();