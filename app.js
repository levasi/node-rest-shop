const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const uri = "mongodb+srv://node-shop:node-shop@node-api-shop-gsisn.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.log(error))

app.use((req, res, next) => {
    res.header("Acces-Control-Allow-Origin", "*")
    res.header("Acces-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization")
    if (req.method === "OPTIONS") {
        res.header("Acces-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE")
        return res.status(200).json({})
    }
    next()
})


const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')



app.use(morgan('dev'))

app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)
app.use('/user', userRoutes)


app.use((req, res, next) => {
    const error = new Error('Not found error')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app