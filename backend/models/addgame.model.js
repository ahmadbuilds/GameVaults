const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const AddGameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [2, 'Game Title must be at least 2 characters long'],
    },
    platform: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['playing', 'completed', 'backlog', 'abandoned']
    },
    progress: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    hoursPlayed: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    description: {
        type: String,
        default: '',
    },
    developer: {
        type: String,
        default: '',
    },
    publisher: {
        type: String,
        default: '',
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    genres: {
        type: [String],
        default: []
    },
    playMode: {
        type: [String],
        default: ['Single-player']
    },
    personalNotes: {
        type: String,
        default: '',
    },
    owned: {
        type: Boolean,
        default: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },
    // New field for multiple media URLs
    mediaUrls: {
        type: [MediaSchema],
        default: []
    }
}, {
    timestamps: true
});

const AddGameModel = mongoose.model('AddGame', AddGameSchema);

module.exports = AddGameModel;