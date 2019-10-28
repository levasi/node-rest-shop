const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product
        .find()
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:300/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(
            error => {
                console.log(error)
                res.status(500).json(
                    {
                        error
                    }
                )
            }
        )
})

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    })

    product.save()
        .then(response => {
            res.status(201).json({
                message: 'Handling POST request from /products',
                createdProduct: {
                    name: response.name,
                    price: response.price,
                    _id: response._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + response._id
                    }
                }
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error })
        })

})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product
        .findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost/products'
                    }
                })
            } else {
                res.status(404).json(
                    { message: "No product found" }
                )
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error
            })
        })
})

router.patch('/:productId', (req, res, next) => {

    const id = req.params.productId
    const updateOptions = {}

    for (const option of req.body) {
        updateOptions[option.propName] = option.value
    }

    Product.update({ _id: id }, {
        $set: updateOptions
    }).exec()
        .then(response => {
            console.log(response);
            res.status(200).json({
                message: "updated product",
                request: {
                    type: 'PATCH',
                    url: 'http://localhost/products/' + id,
                    body: {
                        name: 'String',
                        price: 'Number',
                    }
                }
            })
        })
        .catch(error => {
            res.status(500).json({ error })
        })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.deleteOne({ _id: id })
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                res.status(200).json({
                    message: 'Product deleted',
                    request: {
                        type: 'DELETE',
                        url: 'http://localhost/products' + id
                    }
                })
            } else {
                res.status(404).json({
                    message: 'No entries found'
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
})

module.exports = router