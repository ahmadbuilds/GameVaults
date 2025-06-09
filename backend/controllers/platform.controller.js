const platformService = require('../services/platform.service');


class PlatformController {
    
    async addPlatform(req, res) {
        try {
            const platformData = req.body;
            const platform = await platformService.addPlatform(platformData);
            return res.status(201).json({
                success: true,
                message: 'Platform added successfully',
                data: platform
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to add platform',
                error: error.message
            });
        }
    }

    async searchPlatformsByName(req, res) {
    try {
        const { email } = req.query;
        const { name } = req.query;
        
        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: 'Both email and name query parameters are required'
            });
        }
        
        const platforms = await platformService.searchPlatformsByName(email, name);
        
        return res.status(200).json({
            success: true,
            message: 'Platforms retrieved successfully',
            data: platforms
        });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to search platforms',
                error: error.message
            });
        }
    }

    // Update platform's gamesCount by name
    async updateGameCountByName(req, res) {
        try {
            const { name, email } = req.params;
            
            const platform = await platformService.updateGameCountByName(name, email);
            
            return res.status(200).json({
                success: true,
                message: 'Games count updated successfully',
                data: platform
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update games count',
                error: error.message
            });
        }
    }

    // Get platforms by email 
    async getPlatformsByEmail(req, res) {
        try {
            const { email } = req.query;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email query parameter is required'
                });
            }
            
            const platforms = await platformService.getPlatformsByEmail(email);
            
            return res.status(200).json({
                success: true,
                message: 'Platforms retrieved successfully',
                data: platforms
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve platforms',
                error: error.message
            });
        }
    }

    // Get a single platform by ID
    async getPlatformById(req, res) {
        try {
            const { id } = req.params;
            const platform = await platformService.getPlatformById(id);
            
            if (!platform) {
                return res.status(404).json({
                    success: false,
                    message: 'Platform not found'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Platform retrieved successfully',
                data: platform
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve platform',
                error: error.message
            });
        }
    }

    // Update a platform
    async updatePlatform(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const platform = await platformService.updatePlatform(id, updateData);
            
            if (!platform) {
                return res.status(404).json({
                    success: false,
                    message: 'Platform not found'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Platform updated successfully',
                data: platform
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update platform',
                error: error.message
            });
        }
    }

    // Delete a platform
    async deletePlatform(req, res) {
        try {
            const { id } = req.params;
            const platform = await platformService.deletePlatform(id);
            
            if (!platform) {
                return res.status(404).json({
                    success: false,
                    message: 'Platform not found'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Platform deleted successfully',
                data: platform
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete platform',
                error: error.message
            });
        }
    }
}

module.exports = new PlatformController();