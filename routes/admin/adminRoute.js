const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const multer = require('multer')
const adminController = require('../../controller/admin/adminController')
const categoryController = require('../../controller/admin/categoryController')
const auth = require('../../middleware/admin/auth')


var storage = multer.diskStorage({
    destination: 'public/admin/category/media',
    filename: (request, file, callback) => {
        callback(null, 'Category' + Date.now() + '_' + file.originalname)
    }
})

var upload = multer({storage: storage})

router.post('/login', body('email', 'Invalid Email').isEmail(), body('password').not().isEmpty(), adminController.Login)

// router.post('/register', body('email', 'Invalid Email').isEmail(), body('password').not().isEmpty(), adminController.Register)

router.post('/add-category', auth, upload.single('catImage'), categoryController.addCategory)

router.get('/view-category', categoryController.viewCategory)

router.post('/edit-category/:catId', upload.single('catImage'), categoryController.editCategory)

router.post('/delete-category/:catId', auth, categoryController.deleteCategory)


module.exports = router