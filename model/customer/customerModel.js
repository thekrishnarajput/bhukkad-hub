const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    mobile:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        min: 10,
        max: 10
    },
    password:{
        type: String,
        required: true,
        trim: true,
        min: 4
    },
    status:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model('customers', customerSchema)