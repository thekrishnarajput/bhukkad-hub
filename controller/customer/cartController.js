const { json } = require('body-parser')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Cart = require('../../model/customer/cartModel')
// console.clear()
exports.AddToCart = async (request, response) => {
    const customerId = request.customer._id
    // console.log("Customer Id: ", customerId)
    var check = await Cart.findOne({ customer: customerId});
    // console.log("Cart.findOne check: "+check)
    const dishId = request.body.dishItems
    // console.log('DishItems: ', dishId)
    
    if(!check){
        check = new Cart({
            customer: customerId
        })
    }
    check.dishItems.push(dishId)
    await check.save()
    .then(result => {
        // const token = jwt.sign(
        //     {
        //         cartToken:
        //         {
        //             _id: result._id
        //         }
        //     },
        //     process.env.CART_TOKEN_KEY,
        //     {
        //         expiresIn: "2h",
        //     }
        //     )
        //     console.log("add to cart token: ", token)
         console.log("Check save: "+result);
         return response.status(200).json(result)
     }).catch(err => {
         console.log(err);
         return response.status(200).json(err)
     })
}


exports.ViewCart = async (request, response) => {
    const customerId = request.customer._id
    await Cart.findOne({customer: customerId}).populate('dishItems').exec()
    .then(result => {
        return response.status(200).json(result)
    })
    .catch(error => {
        return response.status(500).json({msg: "error in cart view "})
    })
}

exports.DeleteCartItem = async (request, response) => {
    const {itemId} = request.params
    const customerId = request.customer._id
    console.log("Customer Id from token: " + customerId)
    await Cart.updateOne({customer: customerId},
        {
            $pullAll:
            {
            dishItems: [itemId]
        }
})
    .then(result => {
        console.log(result)
        return response.status(200).json({result})
    })
    .catch(error => {
        console.log("error in catch ",error)
        return response.status(500).json({msg: "Could not delete item"})
    })
}

exports.DeleteCart = async (request, response) => {
    await Cart.deleteMany({_id: request.params.cartId})
    .then(result => {
        return response.status(200).json({msg: "Cart Cleared."})
    })
    .catch(err => {
        return response.status(500).json({ msg: "Could not clear"})
    })
}