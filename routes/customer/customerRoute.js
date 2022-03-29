const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const multer = require('multer')
const auth = require('../../middleware/customer/auth')


const customerController = require('../../controller/customer/customerController')
const customerProfileController = require('../../controller/customer/customerProfileController')
const cartController = require('../../controller/customer/cartController')
const orderController = require('../../controller/customer/orderController')


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

router.post('/login', body('email', 'Invalid Email').isEmail(),
    body('password').not().isEmpty(),
    customerController.Login
)

router.post('/forgot-password', body('email', 'Invalid Email').isEmail(),
    customerController.forgotPassword
)

router.post('/verify-otp', customerController.verifyOTP)

router.post('/verify-email', customerController.verifyEmail)

router.post('/profile/:id', auth, upload.single('profilePic'), customerProfileController.Profile)

router.post('/logout', auth, customerController.Logout)

router.post('/add-to-cart', auth, cartController.AddToCart)

router.post('/view-cart', auth, cartController.ViewCart)

router.post('/delete-cart-item/:itemId', auth, cartController.DeleteCartItem)

router.post('/delete-cart', auth, cartController.DeleteCart)

router.post('/place-order', auth, orderController.PlaceOrder)

// router.post('/view-orders', auth, orderController.ViewOrder)

module.exports = router