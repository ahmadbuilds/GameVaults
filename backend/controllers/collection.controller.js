const CollectionService = require('../services/collection.service');

class CollectionController {
  // Create a new collection
  async createCollection(req, res) {
    try {
      const { name, description, games, tags, isPublic } = req.body;
      const { userEmail } = req.params;

      if (!name || !userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Collection name and user email are required'
        });
      }

      const collectionData = {
        name: name.trim(),
        description: description?.trim() || '',
        userEmail: userEmail.toLowerCase(),
        games: games || [],
        tags: tags || [],
        isPublic: isPublic || false
      };

      const collection = await CollectionService.createCollection(collectionData);

      res.status(201).json({
        success: true,
        message: 'Collection created successfully',
        data: collection
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get collection by ID
  async getCollectionById(req, res) {
    try {
      const { collectionId } = req.params;
      const { userEmail } = req.query;

      if (!collectionId) {
        return res.status(400).json({
          success: false,
          message: 'Collection ID is required'
        });
      }

      const collection = await CollectionService.getCollectionById(
        collectionId, 
        userEmail?.toLowerCase()
      );

      
      if (collection.isPublic) {
        await CollectionService.incrementViewCount(collectionId);
      }

      res.status(200).json({
        success: true,
        data: collection
      });
    } catch (error) {
      console.error('Error fetching collection:', error);
      res.status(error.message.includes('not found') ? 404 : 403).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get all collections by user
  async getUserCollections(req, res) {
    try {
      const { userEmail } = req.params;

      if (!userEmail) {
        return res.status(400).json({
          success: false,
          message: 'User email is required'
        });
      }

      const collections = await CollectionService.getUserCollections(
        userEmail.toLowerCase()
      );

      res.status(200).json({
        success: true,
        data: collections
      });
    } catch (error) {
      console.error('Error fetching user collections:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get public collections
  async getPublicCollections(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await CollectionService.getPublicCollections(page, limit);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching public collections:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Update collection
  async updateCollection(req, res) {
    try {
      const { collectionId, userEmail } = req.params;
      const updateData = req.body;

      if (!collectionId || !userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Collection ID and user email are required'
        });
      }

      const collection = await CollectionService.updateCollection(
        collectionId,
        userEmail.toLowerCase(),
        updateData
      );

      res.status(200).json({
        success: true,
        message: 'Collection updated successfully',
        data: collection
      });
    } catch (error) {
      console.error('Error updating collection:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Add game to collection
  async addGameToCollection(req, res) {
    try {
      const { collectionId, userEmail } = req.params;
      const { gameId } = req.body;

      if (!collectionId || !userEmail || !gameId) {
        return res.status(400).json({
          success: false,
          message: 'Collection ID, user email, and game ID are required'
        });
      }

      const collection = await CollectionService.addGameToCollection(
        collectionId,
        gameId,
        userEmail.toLowerCase()
      );

      res.status(200).json({
        success: true,
        message: 'Game added to collection successfully',
        data: collection
      });
    } catch (error) {
      console.error('Error adding game to collection:', error);
      res.status(error.message.includes('not found') ? 404 : 400).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Remove game from collection
  async removeGameFromCollection(req, res) {
    try {
      const { collectionId, gameId, userEmail } = req.params;

      if (!collectionId || !gameId || !userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Collection ID, game ID, and user email are required'
        });
      }

      const collection = await CollectionService.removeGameFromCollection(
        collectionId,
        gameId,
        userEmail.toLowerCase()
      );

      res.status(200).json({
        success: true,
        message: 'Game removed from collection successfully',
        data: collection
      });
    } catch (error) {
      console.error('Error removing game from collection:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get available games for collection
  async getAvailableGames(req, res) {
    try {
      const { userEmail } = req.params;
      const { collectionId } = req.query;

      if (!userEmail) {
        return res.status(400).json({
          success: false,
          message: 'User email is required'
        });
      }

      const games = await CollectionService.getAvailableGamesForCollection(
        userEmail.toLowerCase(),
        collectionId
      );

      res.status(200).json({
        success: true,
        data: games
      });
    } catch (error) {
      console.error('Error fetching available games:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Add media to collection
  async addMediaToCollection(req, res) {
    try {
      const { collectionId, userEmail } = req.params;
      const { file, type } = req.body;

      if (!collectionId || !userEmail || !file || !type) {
        return res.status(400).json({
          success: false,
          message: 'Collection ID, user email, file, and type are required'
        });
      }

      if (!['image', 'video'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Media type must be either "image" or "video"'
        });
      }

      const collection = await CollectionService.addMediaToCollection(
        collectionId,
        userEmail.toLowerCase(),
        { file, type }
      );

      res.status(200).json({
        success: true,
        message: 'Media added to collection successfully',
        data: collection
      });
    } catch (error) {
      console.error('Error adding media to collection:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Remove media from collection
  async removeMediaFromCollection(req, res) {
    try {
      const { collectionId, userEmail, mediaPublicId } = req.params;
  
      if (!collectionId || !userEmail || !mediaPublicId) {
        return res.status(400).json({
          success: false,
          message: 'Collection ID, user email, and media public ID are required'
        });
      }
  
     
      const decodedPublicId = decodeURIComponent(mediaPublicId);
      console.log('Decoded publicId:', decodedPublicId);
  
      const collection = await CollectionService.removeMediaFromCollection(
        collectionId,
        userEmail.toLowerCase(),
        decodedPublicId 
      );
  
      res.status(200).json({
        success: true,
        message: 'Media removed from collection successfully',
        data: collection
      });
    } catch (error) {
      console.error('Error removing media from collection:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Delete collection
  async deleteCollection(req, res) {
    try {
      const { collectionId, userEmail } = req.params;

      if (!collectionId || !userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Collection ID and user email are required'
        });
      }

      const result = await CollectionService.deleteCollection(
        collectionId,
        userEmail.toLowerCase()
      );

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Toggle like on collection
  async toggleLike(req, res) {
    try {
      const { collectionId } = req.params;
      const { userEmail } = req.body;

      if (!collectionId || !userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Collection ID and user email are required'
        });
      }

      const result = await CollectionService.toggleLikeCollection(
        collectionId,
        userEmail.toLowerCase()
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          liked: result.liked,
          likeCount: result.likeCount
        }
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Search collections
  async searchCollections(req, res) {
    try {
      const { query, isPublicOnly = 'true', page = 1, limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await CollectionService.searchCollections(
        query,
        isPublicOnly === 'true',
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error searching collections:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = new CollectionController();