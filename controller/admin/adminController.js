const {json} = require('body-parser')
const {validationResult} = require('express-validator')
const admin = require('../../model/admin/adminModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.Login = async (request, response) => {
    console.log(request.body)
    const errors = validationResult(request)
    if(!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()})
    }
    const { email, password } = request.body
    await admin.findOne({
        email: email
    })
    .then(result => {
        console.log("Result in then: " + result)
        if(result){
            const match = bcrypt.compare(password, result.password)
                console.log("compare res ", match)
                if (match) {
                    const token = jwt.sign(
                        { admin_id: result._id, email: result.email },
                        process.env.ADMIN_TOKEN_KEY,
                        {
                            expiresIn: "2h",
                        }
                    )
                    return response.status(200).json({msg: "welcome Mr. "+ result.adminName + ", Your token is: " + token})
                }
        }
        else
            return response.status(400).json({msg: "Invalid credentials"})
    })
    .catch(error => {
        console.log("Error in catch "+error)
        return response.status(500).json({msg: "Login Failed! Please try again."})
    })
}
/*
exports.Register = async (request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()) {
        return response.status(403).json({errors: errors.array()})
    }
    const { adminName, email, password, mobile } = request.body
    const hash = await bcrypt.hash(password, 10)
    admin.create({
        adminName: adminName,
        email: email,
        password: hash,
        mobile: mobile
    })
    .then(result => {
        console.log(result)
        return response.status(200).json(result)
    }).catch((err) => {
        return response.status(500).json({msg: "Something went wrong"})
    })
}
*/