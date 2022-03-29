const express = require('express')
require('./database/database')
require('dotenv').config()
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

const adminRoute = require('./routes/admin/adminRoute')
const customerRoute = require('./routes/customer/customerRoute')
const dishRoute = require('./routes/admin/dishRoute')

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/admin', adminRoute)

app.use('/customer', customerRoute)

app.use('/admin/dishes', dishRoute)

const port = process.env.PORT || 8080
app.listen(port,()=>{
    console.log('listening on port',8080)
})