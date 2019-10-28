const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order.js')

router.get('/', (req, res, next) => {
    res.status(200).json({
        chestii: 'trestii'
    })
})

router.post('/', (req, res, next) => {

    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    })

    order.save()
        .then(response => {
            console.log(response)
            res.status(201).json(response)
        })
        .catch(error => {
            res.status(500).json({ error })
        })
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