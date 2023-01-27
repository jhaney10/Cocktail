const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    
    ingredient: {
        type: String
    },
    measurement: {
        type: String
    }
})
const CocktailSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    drinkName: {
        type: String,
        required: true,
        trim: true

    },
    instructions: {
        type: String,
        required: true,
        trim: true
    },
    content: [contentSchema],
    drinkThumbId: {
        type: String
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public','private']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date
    }
})

module.exports = mongoose.model('Cocktail', CocktailSchema);