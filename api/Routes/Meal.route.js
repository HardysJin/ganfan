const express = require('express');
const router = express.Router();

const MealController = require('../Controllers/Meal.Controller');

//Get a list of all products
router.get('/', MealController.getAllMeals);

//Create a new product
router.post('/', MealController.createNewMeal);

//Get a product by id
router.get('/:id', MealController.findMealById);

//Update a product by id
router.post('/:id', MealController.updateAMeal);

// Push an order to meal
router.patch('/:id', MealController.pushToMeal)

//Delete a product by id
router.delete('/:id', MealController.deleteAMeal);



module.exports = router;
