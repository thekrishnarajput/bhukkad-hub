const { json } = require('body-parser')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const customer = require('../../model/customer/customerModel')

exports.Register = (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(403).json({ errors: errors.array() })
    }
    bcrypt.hash(request.body.password, 8, function (error, hash) {
        customer.create({
            name: request.body.name,
            email: request.body.email,
            mobile: request.body.mobile,
            password: hash,
        })
            .then(result => {
                return response.status(200).json({ msg: "Congratulations Mr. :" + result.name + ", Your account has been created successfully" })
            })
            .catch(err => {
                return response.status(500).json({ msg: err.message })
            })
    })
}

exports.Login = async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(403).json({ errors: errors.array() })
    }
    await customer.findOne({
        email: request.body.email
    })
        .then(result => {
            console.log("Then result ", result)
            const email = (request.body.email === result.email)
            console.log("Email Matching ", email)
            bcrypt.compare(request.body.password, result.password, function (err, res) {
                if (res && email) {
                    console.log("compare res ", res)
                    return response.status(200).json({ msg: "Welcome Mr. " + result.name })
                }
                else {
                    console.log("Error in compare then ", err)
                    return response.status(403).json({ msg: "Invalid password" })
                }
            })
        })
        .catch(err => {
            return response.status(500).json({ msg: "Error in catch" })
        })
}