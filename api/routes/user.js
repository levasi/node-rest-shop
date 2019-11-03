const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: 'Mail exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) {
                        res.status(500).json({
                            error
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save().then(result => {
                            console.log(result)
                            res.status(201).json({
                                message: 'User created'
                            })
                        }).catch(error => {
                            if (error) {
                                res.status(500).json({
                                    message: 'Could not create user',
                                    error
                                })
                            }
                        })
                    }
                })
            }
        })
})

router.post('/login', (req, res, next) => {
    User.find({
        email: req.body.email
    })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Authentication failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (error, response) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Authentication failed'
                    })
                }
                if (response) {

                    const token = jwt.sign({
                        email: user[0],
                        _id: user[0]._id
                    }, process.env.JWT_PASSWORD, {
                        expiresIn: '1h'
                    })

                    return res.status(201).json({
                        message: 'Authentication successfull',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Authentication failed'
                })
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    User
        .remove({
            _id: req.params.userId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: 'User could not be deleted'
            })
        })
})


module.exports = router