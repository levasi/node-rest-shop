const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    }
})


router.get('/', checkAuth, ProductsController.get_all_products)

router.post("/", checkAuth, upload.single('productImage'), ProductsController.create_product);

router.get('/:productId', checkAuth, ProductsController.get_product_by_id)

router.patch('/:productId', checkAuth, ProductsController.update_product)

router.delete('/:productId', ProductsController.delete_product)

module.exports = router