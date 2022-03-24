const { json } = require('body-parser')
const { validationResult } = require('express-validator')
require('dotenv').config()
const Cart = require('../../model/customer/cartModel')
// console.clear()
exports.AddToCart = async (request, response) => {
    const customerId = request.customer._id
    console.log("Customer Id: ", customerId)
    const check = await Cart.findOne({ customer: customerId});
    console.log("Cart.findOne check: "+check)
    const dishItems = request.body.dishItems
    console.log('DishItems: ', dishItems)
    if(!check){
        await Cart.create({
            customer: customerId,
            dishItems: dishItems
        })
        .then(result => {
            // console.log("add to cart result: ", result)
            return response.status(200).json(result)
        })
        .catch(error => {
            console.log("add to cart error: ", error)
            return response.status(500).json({msg: "Could not added to cart "})
        })
    }
     dishItems.unshift(request.body.dishItems);
     check.save().then(result => {
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
    const {itemId, customerId} = request.params
    await Cart.updateOne({_id: customerId},
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