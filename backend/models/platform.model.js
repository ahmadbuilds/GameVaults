const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    gamesCount: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Platform', platformSchema);