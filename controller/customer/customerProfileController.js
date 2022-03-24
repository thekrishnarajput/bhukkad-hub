const { json } = require('body-parser')
const { validationResult } = require('express-validator')


const profile = require('../../model/customer/customerProfileModel')
exports.Profile = async (request, response) => {
    const { address1, address2, address3, location, bio } = request.body
    await profile.updateOne({customers: request.params.id},
        {
            $set:
            {
                address1: address1,
                address2: address2,
                address3: address3,
                profilePic: "https://bhukkad-hub.herokuapp.com/customer/media/" + request.file.filename,
                location: location,
                bio: bio,
                updatedAt: Date.now()
            }
        })
        .then(result => {
            console.log("Result in profile: ", result)
            return response.status(200).json({msg: "Profile Updated Successfully!"})
        })
        .catch(err => {
            console.log("Error in profile catch: " + err)
            return response.status(500).json({ msg: "Error while updating profile. "+err })
        })
}