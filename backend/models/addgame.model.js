const mongoose = require('mongoose');

const AddGameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [5, 'Game Title must be at least 5 characters long'],
    },
    notes: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true
});

const AddGameModel = mongoose.model('AddGame', AddGameSchema);

module.exports = AddGameModel;