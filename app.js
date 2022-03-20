const express = require('express')
require('./database/database')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

const adminRoute = require('./routes/admin/adminRoute')
const customerRoute = require('./routes/customer/customerRoute')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/admin', adminRoute)

app.use('/customer', customerRoute)

const port = process.env.PORT || 8080
app.listen(port,()=>{
    console.log('listening on port',8080)
})