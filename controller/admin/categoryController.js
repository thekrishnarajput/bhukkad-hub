const {json} = require('body-parser')
const {validationResult} = require('express-validator')
const category = require('../../model/admin/categoryModel')

exports.addCategory = (request, response) => {
    category.create({
        catName: request.body.catName,
        catImage: "https://bhukkad-hub.herokuapp.com/admin/category/media/" + request.file.filename
    })
    .then(result => {
        return response.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        return response.status(500).json({msg: "Category couldn't be added."})
    })
}

exports.viewCategory = (request, response) => {
    category.find({})
    .then(result => {
        return response.status(200).json(result)
    })
    .catch(err => {
        return response.status(500).json({msg: "Category not found.'"})
    })
}

exports.editCategory = (request, response) => {
    category.updateOne({_id: request.params.catId},{$set:{
        catName: request.body.catName,
        catImage: "https://bhukkad-hub.herokuapp.com/admin/category/media/" + request.file.filename
    }})
    .then(result => {
        return response.status(200).json({msg: "Category has been updated successfully."})
    })
    .catch(err => {
        console.log(err)
        return response.status(500).json({msg: "Category couldn't be edited."})
    })
}

exports.deleteCategory = (request, response) =>{
    category.deleteOne({_id: request.params.catId})
    .then(result => {
        return response.status(200).json(result)
    })
    .catch(err => {
        return response.status(500).json({msg: "Category couldn't be deleted'"})
    })
}