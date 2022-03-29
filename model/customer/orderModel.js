const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    mobile: {
        type: String,
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
    // dishItems: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'dishes'
    // }],
    orderItems: [
        {
            type: Object,
        }
    ],
    orderedAt: {
        type: Date,
        default: Date('August 19, 1975 23:15:30 GMT+05:30')
    },
})

module.exports = mongoose.model("orders", orderSchema)