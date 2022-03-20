const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const adminController = require('../../controller/admin/adminController')

router.post('/login', body('email', 'Invalid Email').isEmail(),
    body('password').not().isEmpty(),
    adminController.Login
)

module.exports = router