const mongoose = require('mongoose')
require('dotenv').config()
const mongoPassword = process.env.MONGO_PASSWORD
const mongoUser = process.env.MONGO_USER
const db = process.env.MONGO_DB
const server = "bhukkad-hub.heroku.com"
const port = process.env.PORT || 8080
const url = "mongodb+srv://"+mongoUser+":"+mongoPassword+"@practice.h6lsp.mongodb.net/"+db+"?retryWrites=true&w=majority"

class Database {

    constructor() { this._connect() }

    _connect() {
        mongoose.connect(url, { useNewUrlParser: true })
            .then(() => {
                console.log('Database connection successful')
            }).catch(err => {
                console.error('Database connection error')
            })
    }

    _disconnect() {
        mongoose.disconnect()
            .then(() => {
                console.log('Database disconnected successfully')
            }).catch(err => {
                console.error('Database connection error')
            });
    }

    _connection() {
        return {
            host: server,
            port: port,
            db: db,
            url: url
        }
    }
}

module.exports = new Database();