const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 10
    },
    address: {
        type: String,
    },
    paymentMethod: [{
        mode: {
            type: String
        },
        transactionId: {
            type: String
        }
    }],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers'
    },
    dishItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dishes'
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model("orders", orderSchema)