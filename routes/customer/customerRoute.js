const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const multer = require('multer')
const auth = require('../../middleware/customer/auth')
require('dotenv').config()


const customerController = require('../../controller/customer/customerController')
const customerProfileController = require('../../controller/customer/customerProfileController')


var storage = multer.diskStorage({
    destination: 'public/customer/media',
    filename: (request, file, callback) => {
        callback(null, "Profile" + Date.now() + "_" + file.originalname)
    }
})

let upload = multer({storage: storage})

router.post('/register', body('name').isAlpha(),
body('email').isEmail().not().isEmpty(),
body('password').not().isEmpty(),
body('mobile').isNumeric().not().isEmpty(),
customerController.Register
)

router.post('/login', auth, body('email', 'Invalid Email').isEmail(),
    body('password').not().isEmpty(),
    customerController.Login
)

router.post('/forgot-password', body('email', 'Invalid Email').isEmail(),
    customerController.forgotPassword
)

router.post('/verify-otp', customerController.verifyOTP
)

router.post('/profile', upload.single('profilePic'), customerProfileController.Profile)

module.exports = router