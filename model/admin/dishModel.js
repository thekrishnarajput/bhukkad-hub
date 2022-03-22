const mongoose = require('mongoose')
const dishSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    dishName: {
        type: String,
        required: true,
    },
    dishImage: {
        type: String,
        trim: true,
    },
    dishPrice: {
        type: Number,
        required: true
    },
    stockStatus: {
        type: String,
        default: 'Available'
    },
    dishDescription: {
        type: String,
    }
})

module.exports = mongoose.model('dishes', dishSchema)