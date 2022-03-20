const {json} = require('body-parser')
const {validationResult} = require('express-validator')
const admin = require('../../model/admin/adminModel')

exports.Login = (request, response) => {
    console.log(request.body)
    const errors = validationResult(request)
    if(!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()})
    }
    admin.findOne({
        email: request.body.email,
        password: request.body.password
    })
    .then(result => {
        console.log("Result in then: " + result)
        if(result){
            return response.status(200).json({msg: "welcome Mr. "+ result.adminName})
        }
        else
            return response.status(400).json({msg: "Invalid credentials"})
    })
    .catch(error => {
        console.log("Error in catch "+error)
        return response.status(500).json({msg: "Login Failed! Please try again."})
    })
}

// exports.register = (request, response) => {
//     const errors = validationResult(request)
//     if(!errors.isEmpty()) {
//         return response.status(403).json({errors: errors.array()})
//     }
//     admin.create({
//         adminName: request.body.adminName,
//         email: request.body.email,
//         password: request.body.password,
//         mobile: request.body.mobile
//     })
//     .then(result => {
//         console.log(result)
//         return response.status(200).json(result)
//     }).catch((err) => {
//         return response.status(500).json({msg: "Something went wrong"})
//     })
// }