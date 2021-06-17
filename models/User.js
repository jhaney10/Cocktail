const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    providerId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    provider: {
        type: String,
    },
    image: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema);