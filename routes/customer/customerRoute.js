const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const customerController = require('../../controller/customer/customerController')

router.post('/login', body('email', 'Invalid Email').isEmail(),
    body('password').not().isEmpty(),
    customerController.Login
)

router.post('/register', body('name').isAlpha().not().isEmpty(),
    body('email').isEmail().not().isEmpty(),
    body('password').not().isEmpty(),
    body('mobile').isNumeric().not().isEmpty(),
    customerController.Register
)

module.exports = router