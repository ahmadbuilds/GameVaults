const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  games: [{
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AddGame', 
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  media: [{
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Method to add a game to the collection
collectionSchema.methods.addGame = function(gameId) {
  if (!this.games.some(game => game.gameId.toString() === gameId.toString())) {
    this.games.push({ gameId });
    return true;
  }
  return false;
};

// Method to remove a game from the collection
collectionSchema.methods.removeGame = function(gameId) {
  const initialLength = this.games.length;
  this.games = this.games.filter(game => game.gameId.toString() !== gameId.toString());
  return this.games.length < initialLength;
};

// Method to add media
collectionSchema.methods.addMedia = function(mediaData) {
  this.media.push(mediaData);
};

// Method to remove media
collectionSchema.methods.removeMedia = function(publicId) {
  const initialLength = this.media.length;
  this.media = this.media.filter(media => media.publicId !== publicId);
  return this.media.length < initialLength;
};

// Method to toggle like
collectionSchema.methods.toggleLike = function(userEmail) {
  const likeIndex = this.likes.findIndex(like => like.userEmail === userEmail);
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
    return false; 
  } else {
    this.likes.push({ userEmail });
    return true; 
  }
};

// Static method to find collections by user
collectionSchema.statics.findByUser = function(userEmail) {
  return this.find({ userEmail }).populate('games.gameId');
};

module.exports = mongoose.model('Collection', collectionSchema);