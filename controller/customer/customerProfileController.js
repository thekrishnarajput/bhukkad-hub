const { json } = require('body-parser')
const { validationResult } = require('express-validator')


const profile = require('../../model/customer/customerProfileModel')

exports.Profile = (request, response) => {
    profile.updateOne({customers: request.body.customerId}, {$set:{
        address1: request.body.address1,
        address2: request.body.address2,
        address3: request.body.address3,
        profilePic: "https://bhukkad-hub.herokuapp.com/customer/media/" + request.file.filename,
        location: request.body.location,
        bio: request.body.bio
    }})
        .then(result => {
            console.log("Result in profile: ", result)
            return response.status(200).json({msg: "Profile Updated Successfully!"})
        })
        .catch(err => {
            console.log("Error in profile catch: " + err)
            return response.status(500).json({ msg: "Error while updating profile." })
        })
}