const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers'
    },
    dishItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'dishes'
    }]
})

module.exports = mongoose.model('carts', cartSchema)