const jwt = require("jsonwebtoken")
const db = require('../../model/customer/customerModel')

const config = process.env

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["token"]

    if (!token) {
        return res.status(403).json("A token is required for authentication")
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY)
        req.cartToken = decoded.customer
    } catch (err) {
        return res.status(401).json({err: "Invalid Token" + err})
    }
    return next()
}
module.exports = verifyToken