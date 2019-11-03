
const Product = require('../models/product.js')
const mongoose = require('mongoose')

exports.get_all_products = (req, res, next) => {
    Product
        .find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
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
}

exports.create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_product_by_id = (req, res, next) => {
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
}

exports.update_product = (req, res, next) => {

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
}

exports.delete_product = (req, res, next) => {
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
}