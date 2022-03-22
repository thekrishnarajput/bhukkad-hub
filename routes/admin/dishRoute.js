const express = require('express')
const router = express.Router()
const multer = require('multer')

const auth = require('../../middleware/admin/auth')

const dishController = require('../../controller/admin/dishController')

var storage = multer.diskStorage({
    destination: 'public/admin/dish/media',
    filename: (request, file, callback) => {
        callback(null, 'Dish' + Date.now() + '_' + file.originalname)
    }
})

var upload = multer({storage: storage})

router.post('/add-dish', auth, upload.single('dishImage'), dishController.addDish)

router.get('/view-dishes', auth, dishController.viewDishes)

router.post('/edit-dish/:dishId', auth, upload.single('dishImage'), dishController.editDish)

router.post('/delete-dish/:dishId', auth, dishController.deleteDish)


module.exports = router