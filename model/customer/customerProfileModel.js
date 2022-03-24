const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    customers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },
    address1: {
        type: String
    },
    address2: {
        type: String
    },
    address3: {
        type: String
    },
    profilePic: {
        type: String,
        trim: true
    },
    location: {
        type: String,
    },
    bio: {
        type: String
    },
    updatedAt: {
        type: Date
    }
})

module.exports = mongoose.model('profiles', profileSchema)