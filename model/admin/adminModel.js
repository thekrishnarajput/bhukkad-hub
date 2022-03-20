const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    adminName: {type: String},
    email: {type: String},
    password: {type: String},
    mobile: {type: String},
    otp: {type: String}
})

module.exports = mongoose.model("admins", adminSchema)