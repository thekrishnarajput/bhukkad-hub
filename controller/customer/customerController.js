const { json } = require('body-parser')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const id = 'ACdf149fd0a805582d3bb78b98b26ddd12'
const twilioToken = '9624c050222ef952f239b324b8926f26'
const client = require('twilio')(id, twilioToken);

const customer = require('../../model/customer/customerModel')
const profile = require('../../model/customer/customerProfileModel')

const random = process.env.RANDOM

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

exports.Register = async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(403).json({ errors: errors.array() })
    }
    const { name, email, mobile, password } = request.body
    const oldCustomer = await customer.findOne({ email })
    if (oldCustomer) {
        return response.status(409).json({ msg: "This email is already associated with another account. Try another one." })
    }
    function randomString(length, chars) {
        var results = '';
        for (var i = length; i > 0; --i) results += chars[Math.floor(Math.random() * chars.length)]
        return results;
    }
    var otp = randomString(6, random)
    const hash = await bcrypt.hash(password, 10)
    customer.create({
        name: name,
        email: email,
        mobile: mobile,
        password: hash,
        otp: otp,
        tokens: ""
    })
        .then(result => {
            console.log(result)
            let mailDetails = {
                from: '"Bhukkad Hub 👻" <geekhunters001@gmail.com>', // sender address
                to: result.email, // list of receivers
                subject: "Email verification!", // Subject line
                text: "Registration Successful", // plain text body
                html: "<b>Congratulations " + result.name + "! Your account has been created successfully on</b>" +
                    "<h3><a href='https://bhukkad-hub.herokuapp.com'>Bhukkad Hub</a></h3>" +
                    " <b>Your otp is: " + otp + " Click on the <a href='https://bhukkad-hub.herokuapp/customer/verify-email'>link</a>" +
                    " and enter the Given otp there to activate your account.</b>" +
                    "<b><br><br><br>Regards<br><h5>Bhukkad Hub</h5></b>"
            }
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs')
                } else {
                    console.log('Email sent successfully')
                }
            })
            console.log("Customer ID: " + result._id)
            const recMobile = "whatsapp:+91"+result.mobile
            console.log("Receiving mobile no.: " + recMobile)
            client.messages.create(
                {
                    // Message to be sent
                    body: "Congratulations " + result.name + "! Your account has been created successfully on"+
                    "*Bhukkad Hub.* Your otp is: " + otp + "Click on https://bhukkad-hub.herokuapp/customer/verify-email" +
                    "and enter the Given otp there to activate your account.",
                    // Senders Number (Twilio Sandbox No.)
                    from: 'whatsapp:+14155238886',
                    // Number receiving the message
                    to: 'whatsapp:+919669660535' //recMobile
                })
                    .then(message =>{
                        console.log("Message sent on whatsapp successfully")
                        console.log(message)
                    })
                    .done();

            profile.create({
                customers: result._id,
                address1: "",
                address2: "",
                address3: "",
                profilePic: "",
                location: "",
                bio: ""
            })
                .then(result => {
                    console.log("Result of profile create: " + result)
                })
                .catch(err => {
                    console.log("Error in profile create: " + err)
                })
            return response.status(200).json({ msg: "Congratulations Mr. :" + result.name + ", Your account has been created successfully, Please activate your account." })
        })
        .catch(err => {
            return response.status(500).json({ msg: err.message })
        })
}

exports.verifyEmail = async (request, response) => {
    customer.findOne({ email: request.body.email })
        .then(result => {
            console.log("Database OTP: " + result.otp)
            if (result.otp === request.body.otp) {
                customer.updateOne({
                    email: request.body.email
                },
                    {
                        $set: {
                            status: true,
                            otp: ""
                        }
                    })
                    .then(result => {
                        console.log("UpdateOne Result: " + result)
                        return response.status(200).json({ msg: "Your account has been activated successfully." })
                    })
                    .catch(err => {
                        console.log("Error in IF OTP: " + err)
                        return response.status(500).json({ err })
                    })
            }
            else {
                return response.status(500).json({ msg: "Invalid OTP, Please try again." })
            }
        })
        .catch(err => {
            console.log("Error in outer catch: ", err)
            return response.status(500).json({ msg: "Invalid Email." })
        })
}

exports.Login = async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response.status(403).json({ errors: errors.array() })
    }
    const { email, password } = request.body
    await customer.findOne({
        email: email
    })
        .then(result => {
            if (result.status) {
                // console.log("Then result ", result)
                const match = bcrypt.compare(password, result.password)
                console.log("compare res ", match)
                if (match) {
                    console.log("result id for customer token : ", result._id)
                    const token = jwt.sign(
                         {customer:{
                            _id: result._id,
                            email: result.email
                         }},
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "2h",
                        }
                    )
                    customer.updateOne({email: result.email},{$set: {tokens: token, updatedAt: Date.now()}})
                    .then(result => {
                        console.log("Token updated successfully")
                    })
                    .catch(err => {
                        console.log("Token could not be updated successfully")
                    })
                    response.status(200).json({ msg: "Welcome " + result.name + "! Your token is: " + token })
                }
                else {
                    console.log("Error in compare then ", err)
                    return response.status(403).json({ msg: "Invalid password" })
                }
            }
            else {
                return response.status(403).json({ msg: "Account is not activated, Please check your inbox and activate your account." })
            }
        })
        .catch(err => {
            return response.status(500).json({ msg: "Invalid Email" })
        })
}

exports.Logout = (request, response) => {
    // const {} = request.headers['token']
    const token = jwt.sign(
        {
            email: "",
            id: ""
        },
        process.env.TOKEN_KEY,
        {
            expiresIn: 1,
        }
    )
    customer.updateOne({tokens: request.headers["token"]},{$set: {tokens: token}})
                    .then(result => {
                        console.log("Token updated successfully")
                    })
                    .catch(err => {
                        console.log("Token could not be updated successfully")
                    })
    return response.status(200).json({ msg: "Logged out successfully. Token Is: ", token })
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
        var rString = randomString(6, random)
        console.log("Output otp string: " + rString);
        let mailDetails = {
            from: '"Bhukkad Hub 👻" <geekhunters001@gmail.com>', // sender address
            to: result.email, // list of receivers
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
        customer.updateOne({ email: request.body.email }, { $set: { otp: rString } })
            .then(result => {
                console.log("rString Result: " + result)
                return response.status(200).json({ msg: "Password reset email sent successfully! Check your inbox." })
                //  return response.status(200).json(result)
            })


            .catch(err => {
                return response.status(500).json({ msg: "OTP not saved" })
            })
    })
        .catch(err => {
            return response.status(500).json({ msg: "Invalid Email" })
        })
}

exports.verifyOTP = (request, response) => {
    customer.findOne({ email: request.body.email })
        .then(result => {
            console.log("Database OTP: " + result.otp)
            if (result.otp === request.body.otp) {
                bcrypt.hash(request.body.newPassword, 10, (error, hash) => {
                    if (!error) {
                        customer.updateOne({
                            email: request.body.email
                        },
                            {
                                $set: {
                                    password: hash,
                                    otp: ""
                                }
                            })
                            .then(result => {
                                console.log("UpdateOne Result: " + result)
                                return response.status(200).json({ msg: "Your Password has been updated successfully." })
                            })
                            .catch(err => {
                                console.log("Error in IF OTP: " + err)
                                return response.status(500).json({ err })
                            })
                    }
                    else
                        console.log("Hashing Error: " + error)
                })
            }
            else {
                return response.status(500).json({ msg: "Invalid OTP, Please try again." })
            }
        })
        .catch(err => {
            console.log("Error in outer catch: ", err)
            return response.status(500).json({ msg: "Invalid Email." })
        })
}