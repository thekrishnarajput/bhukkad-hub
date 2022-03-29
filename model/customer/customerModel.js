const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        min: 10,
        max: 10
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 4
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: Date().toString() //toLocaleString()
    },
    updatedAt: {
        type: Date,
        default: Date('August 19, 1975 23:15:30 GMT+05:30'),
    },
    otp: {
        type: String
    },
    tokens: {
        type: String
    }
})

module.exports = mongoose.model('customers', customerSchema)