const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')


router.post('/signup', checkAuth, UsersController.sign_up)

router.post('/login', checkAuth, UsersController.login)

router.delete('/:userId', checkAuth, UsersController.delete)


module.exports = router