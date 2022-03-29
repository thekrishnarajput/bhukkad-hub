const { json } = require("body-parser");
const { validationResult } = require("express-validator");
const Dish = require("../../model/admin/dishModel");

exports.addDish = async (request, response) => {
  const { catId, dishName, dishPrice, dishDescription } = request.body;
  await Dish.create({
    category: catId,
    dishName: dishName,
    dishImage:
      "https://bhukkad-hub.herokuapp.com/admin/dish/media/" +
      request.file.filename,
    dishPrice: dishPrice,
    dishDescription: dishDescription,
  })
    .then((result) => {
      console.log("result in then: " + result);
      return response.status(200).json(result);
    })
    .catch((err) => {
      console.log("Error in catch: " + err);
      return response.status(500).json({ err });
    });
};

exports.viewDishes = (request, response) => {
  Dish.find({})
    .populate('category','catName')
    .then((result) => {
      console.log(result);
      return response.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ err });
    });
};

exports.editDish = async (request, response) => {
  const { dishName, dishPrice, dishDescription } = request.body;
  const { filename } = request.file.filename;
  await Dish.updateOne(
    { _id: request.params.dishId },
    {
      $set: {
        dishName: dishName,
        dishImage: "https://bhukkad-hub.herokuapp.com/admin/dish/media/" + filename,
        dishPrice: dishPrice,
        dishDescription: dishDescription,
      },
    }
  )
    .then((result) => {
      console.log(result);
      return response
        .status(200)
        .json({ msg: "Dish has been updated successfully." });
    })
    .catch((err) => {
      console.log("Error in catch: ", err);
      return response.status(500).json({ msg: "Dish could not be updated." });
    });
};

exports.deleteDish = (request, response) => {
  Dish.deleteOne({ _id: request.params.dishId })
    .then((result) => {
      console.log("Result is then for delete dish: ", result);
      return response
        .status(200)
        .json({ msg: "Dish has been deleted successfully." });
    })
    .catch((err) => {
      console.log("Error in catch deleting: " + err);
      return response.status(500).json({ msg: "Dish could not be deleted." });
    });
};
