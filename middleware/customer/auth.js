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
        req.customer = decoded.customer
    } catch (err) {
        return res.status(401).json({err: "Invalid Token" + err})
    }
    // db.findOne(req.body).then(result => {
    //     console.log("Token then: ",result)
    // })
    // .catch(err => {
    //     console.log("Error in Tokens catch: ",err)
    // })
    return next()
}
module.exports = verifyToken

// exports.tokens = (req, res, next) => {
//     db.findOne(req.body).then(result => {
//         if(!result.tokens === req.headers["token"]){
//         console.log("Token then: ",result)
//         next()
//         }
//     })
//     .catch(err => {
//         console.log("Error in Tokens catch: ",err)
//     })
// }