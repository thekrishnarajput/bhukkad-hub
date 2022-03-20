const { json } = require('body-parser')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const customer = require('../../model/customer/customerModel')
const nodemailer = require('nodemailer')

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'geekhunters001@gmail.com',
        pass: 'geek@hunters'
    }
});

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
            otp: ""
        })
            .then(result => {
                let mailDetails = {
                    from: '"Bhukkad Hub 👻" <geekhunters001@gmail.com>', // sender address
                    to: result.email, // list of receivers
                    subject: "Registration Verification", // Subject line
                    text: "Registration Successful", // plain text body
                    html: "<b>Congratulations " + result.name + "! Your account has been created successfully on" +
                        "<h3><a href='https://bhukkad-hub.herokuapp.com'>Bhukkad Hub</a></h3></b>" +
                        "<b>Regards<br><h5>Bhukkad Hub</h5></b>"
                }
                mailTransporter.sendMail(mailDetails, function (err, data) {
                    if (err) {
                        console.log('Error Occurs');
                    } else {
                        console.log('Email sent successfully');
                    }
                });
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
            bcrypt.compare(request.body.password, result.password, function (err, res) {
                console.log("compare res ", res)
                if (res) {
                    return response.status(200).json({ msg: "Welcome Mr. " + result.name })
                }
                else {
                    console.log("Error in compare then ", err)
                    return response.status(403).json({ msg: "Invalid password" })
                }
            })
        })
        .catch(err => {
            return response.status(500).json({ msg: "Invalid Email" })
        })
}

exports.forgotPassword = async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(403).json({ errors: errors.array() })
    }
    await customer.findOne({
        email: request.body.email
    }).then(result => {
        function randomString(length, chars) {
            var results = '';
            for (var i = length; i > 0; --i) results += chars[Math.floor(Math.random() * chars.length)]
            return results;
        }
        var rString = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
        console.log("output"+rString);
        let mailDetails = {
            from: '"Bhukkad Hub 👻" <geekhunters001@gmail.com>', // sender address
            to: "devikakushwah29@gmail.com", // list of receivers
            subject: "Forgot Password", // Subject line
            text: "Registration Successful", // plain text body
            html: "<b>Hey " + result.name + "! Here is the otp: " + rString +
                "<h3><a href='https://bhukkad-hub.herokuapp.com'> Bhukkad Hub</a></h3></b>" +
                "<b>Regards<br><h5>Bhukkad Hub</h5></b>"
        }
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });
        customer.updateOne({email: request.body.email},{$set:{otp: rString}})
        .then(result => {
            console.log("rString Result: "+result)
            return response.status(200).json({ msg: "Password reset email sent successfully! Check your inbox." })
           //  return response.status(200).json(result)
        })
        .catch(err => {
            return response.status(500).json({msg: "OTP not saved"})
        })
       
    })
        .catch(err => {
            return response.status(500).json({ msg: "Invalid Email" })
        })
}

exports.verifyOTP = (request, response) => {
    customer.findOne(request.body.email)
    .then(result => {
        console.log("Database OTP: " + result.otp)
        if(result.otp === request.body.otp) {
            customer.updateOne({$set:{password: request.body.newPassword}}).then(result => {
                return response.status(200).json({msg: "Your Password has been updated successfully."})
            }).catch(err => {
                console.log("Error in IF OTP: "+err)
                return response.status(500).json({err})
            })
        }
        else {
            return response.status(500).json({msg: "Invalid OTP, Please try again."})
        }
    })
    .catch(err => {
        return response.status(500).json({msg: "Invalid Email."})
    })
}