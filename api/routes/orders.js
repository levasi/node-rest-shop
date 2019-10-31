const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order.js')
const Product = require('../models/product.js')

router.get('/', (req, res, next) => {
    Order
        .find()
        .exec()
        .then(response => {
            res.status(200).json({
                count: response.length,
                orders: response.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity
                    }
                }),
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        chestii: 'trestii',
        id,
        message: 'Order details'
    })
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        order: 'Deleted',
        id: req.params.orderId
    })
})

module.exports = router