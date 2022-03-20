const { json } = require('body-parser')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const customer = require('../../model/customer/customerModel')
const nodemailer = require('nodemailer')

async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
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
    let info = await transporter.sendMail({
        from: '"Bhukkad Hub 👻" <geekhunters001@gmail.com>', // sender address
        to: request.body.email, // list of receivers
        subject: "Registration Verification", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      main().catch(console.error);
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