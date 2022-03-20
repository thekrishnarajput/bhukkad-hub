const mongoose = require('mongoose')
require('dotenv').config()
const server = "bhukkad-hub.heroku.com"
const db = "bhukkad-hub"
const port = process.env.PORT || 8080
const url = "mongodb+srv://thekrishnarajput:mongoPassword@practice.h6lsp.mongodb.net/bhukkad-hub?retryWrites=true&w=majority"

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