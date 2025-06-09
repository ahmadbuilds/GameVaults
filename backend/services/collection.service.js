const Collection = require('../models/collection.model');
const AddGame = require('../models/addgame.model'); 
const cloudinary = require('cloudinary').v2;

class CollectionService {
  // Create a new collection
  async createCollection(collectionData) {
    try {
      const collection = new Collection(collectionData);
      await collection.save();
      return await this.getCollectionById(collection._id, collectionData.userEmail);
    } catch (error) {
      throw new Error(`Error creating collection: ${error.message}`);
    }
  }

  // Get collection by ID
  async getCollectionById(collectionId, userEmail = null) {
    try {
      const collection = await Collection.findById(collectionId)
        .populate({
          path: 'games.gameId',
          model: 'AddGame', 
          select: 'title platform status genres rating description imageUrl userEmail'
        });

      if (!collection) {
        throw new Error('Collection not found');
      }

     
      if (!collection.isPublic && collection.userEmail !== userEmail) {
        throw new Error('Access denied to private collection');
      }

      return collection;
    } catch (error) {
      throw new Error(`Error fetching collection: ${error.message}`);
    }
  }

  // Get all collections by user
  async getUserCollections(userEmail) {
    try {
      return await Collection.find({ userEmail })
        .populate({
          path: 'games.gameId',
          model: 'AddGame', 
          select: 'title platform status genres rating description imageUrl'
        })
        .sort({ updatedAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching user collections: ${error.message}`);
    }
  }

  // Get public collections
  async getPublicCollections(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const collections = await Collection.find({ isPublic: true })
        .populate({
          path: 'games.gameId',
          model: 'AddGame', 
          select: 'title platform status genres rating imageUrl'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Collection.countDocuments({ isPublic: true });

      return {
        collections,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(`Error fetching public collections: ${error.message}`);
    }
  }

  // Update collection
  async updateCollection(collectionId, userEmail, updateData) {
    try {
      const collection = await Collection.findOne({ 
        _id: collectionId, 
        userEmail 
      });

      if (!collection) {
        throw new Error('Collection not found or access denied');
      }

      // Update allowed fields
      const allowedUpdates = ['name', 'description', 'isPublic', 'tags'];
      allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
          collection[field] = updateData[field];
        }
      });

      collection.updatedAt = new Date(); 
      await collection.save();
      return await this.getCollectionById(collectionId, userEmail);
    } catch (error) {
      throw new Error(`Error updating collection: ${error.message}`);
    }
  }

  // Add game to collection
  async addGameToCollection(collectionId, gameId, userEmail) {
    try {
      const collection = await Collection.findOne({ 
        _id: collectionId, 
        userEmail 
      });

      if (!collection) {
        throw new Error('Collection not found or access denied');
      }

      
      const game = await AddGame.findOne({ _id: gameId, userEmail });
      if (!game) {
        throw new Error('Game not found or access denied');
      }

      
      const gameExists = collection.games.some(g => g.gameId.toString() === gameId);
      if (gameExists) {
        throw new Error('Game already exists in this collection');
      }

      collection.addGame(gameId);
      collection.updatedAt = new Date(); 
      await collection.save();
      
      return await this.getCollectionById(collectionId, userEmail);
    } catch (error) {
      throw new Error(`Error adding game to collection: ${error.message}`);
    }
  }

  // Remove game from collection
  async removeGameFromCollection(collectionId, gameId, userEmail) {
    try {
      const collection = await Collection.findOne({ 
        _id: collectionId, 
        userEmail 
      });

      if (!collection) {
        throw new Error('Collection not found or access denied');
      }

      const removed = collection.removeGame(gameId);
      if (!removed) {
        throw new Error('Game not found in collection');
      }

      collection.updatedAt = new Date(); 
      await collection.save();
      return await this.getCollectionById(collectionId, userEmail);
    } catch (error) {
      throw new Error(`Error removing game from collection: ${error.message}`);
    }
  }

  // Get available games for collection (games not in any collection by user)
  async getAvailableGamesForCollection(userEmail, collectionId = null) {
    try {
     
      const userGames = await AddGame.find({ userEmail }); 

      
      const collections = await Collection.find({ userEmail });
      const gamesInCollections = new Set();

      collections.forEach(collection => {
        
        if (collectionId && collection._id.toString() !== collectionId) {
          collection.games.forEach(game => {
            gamesInCollections.add(game.gameId.toString());
          });
        } else if (!collectionId) {
          collection.games.forEach(game => {
            gamesInCollections.add(game.gameId.toString());
          });
        }
      });

     
      const availableGames = userGames.filter(game => 
        !gamesInCollections.has(game._id.toString())
      );

      return availableGames;
    } catch (error) {
      throw new Error(`Error fetching available games: ${error.message}`);
    }
  }

  // Add media to collection 
  async addMediaToCollection(collectionId, userEmail, mediaData) {
    try {
      const collection = await Collection.findOne({ 
        _id: collectionId, 
        userEmail 
      });

      if (!collection) {
        throw new Error('Collection not found or access denied');
      }

    
      let uploadResult;
      if (mediaData.type === 'video') {
        uploadResult = await cloudinary.uploader.upload(mediaData.file, {
          resource_type: 'video',
          folder: 'game-collections/videos',
          public_id: `collection_${collectionId}_${Date.now()}`
        });
      } else {
        uploadResult = await cloudinary.uploader.upload(mediaData.file, {
          resource_type: 'image',
          folder: 'game-collections/images',
          public_id: `collection_${collectionId}_${Date.now()}`
        });
      }

      const media = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        type: mediaData.type
      };

      collection.addMedia(media);
      collection.updatedAt = new Date(); 
      await collection.save();

      return await this.getCollectionById(collectionId, userEmail);
    } catch (error) {
      throw new Error(`Error adding media to collection: ${error.message}`);
    }
  }

  // Remove media from collection
  async removeMediaFromCollection(collectionId, userEmail, mediaPublicId) {
    try {
      const collection = await Collection.findOne({ 
        _id: collectionId, 
        userEmail 
      });

      if (!collection) {
        throw new Error('Collection not found or access denied');
      }

      const removed = collection.removeMedia(mediaPublicId);
      if (!removed) {
        throw new Error('Media not found in collection');
      }

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(mediaPublicId);

      collection.updatedAt = new Date();
      await collection.save();
      return await this.getCollectionById(collectionId, userEmail);
    } catch (error) {
      throw new Error(`Error removing media from collection: ${error.message}`);
    }
  }

  // Delete collection
  async deleteCollection(collectionId, userEmail) {
    try {
      const collection = await Collection.findOne({ 
        _id: collectionId, 
        userEmail 
      });

      if (!collection) {
        throw new Error('Collection not found or access denied');
      }

      // Delete all media from Cloudinary
      if (collection.media.length > 0) {
        const publicIds = collection.media.map(media => media.publicId);
        await cloudinary.api.delete_resources(publicIds);
      }

      await Collection.findByIdAndDelete(collectionId);
      return { message: 'Collection deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting collection: ${error.message}`);
    }
  }

  // Toggle like on collection
  async toggleLikeCollection(collectionId, userEmail) {
    try {
      const collection = await Collection.findById(collectionId);

      if (!collection) {
        throw new Error('Collection not found');
      }

      if (!collection.isPublic) {
        throw new Error('Cannot like private collection');
      }

      const liked = collection.toggleLike(userEmail);
      await collection.save();

      return {
        liked,
        likeCount: collection.likes.length,
        message: liked ? 'Collection liked' : 'Collection unliked'
      };
    } catch (error) {
      throw new Error(`Error toggling like: ${error.message}`);
    }
  }

  // Increment view count
  async incrementViewCount(collectionId) {
    try {
      await Collection.findByIdAndUpdate(
        collectionId,
        { $inc: { views: 1 } }
      );
    } catch (error) {
      throw new Error(`Error incrementing view count: ${error.message}`);
    }
  }

  // Search collections
  async searchCollections(query, isPublicOnly = true, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      };

      if (isPublicOnly) {
        searchQuery.isPublic = true;
      }

      const collections = await Collection.find(searchQuery)
        .populate({
          path: 'games.gameId',
          model: 'AddGame', 
          select: 'title platform status genres rating imageUrl'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Collection.countDocuments(searchQuery);

      return {
        collections,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(`Error searching collections: ${error.message}`);
    }
  }
}

module.exports = new CollectionService();