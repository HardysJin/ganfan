const createError = require('http-errors');
const mongoose = require('mongoose');

// const {Meal, Order} = require('../Models/Meal.model');
const myModule = require('../Models/Meal.model');
const Meal = myModule.meal;
const Order = myModule.order;
const User = require('../Models/User.model');
const { formatName } = require('./User.Controller');

module.exports = {
  getAllMeals: async (req, res, next) => {
    try {
      const results = await Meal.find({}, { __v: 0 }).sort({date: -1});
      // let out = {}
      // results.forEach(res => {
      //   out[res['_id']] = res
      // })
      // const results = await Meal.find({}, { name: 1, price: 1, _id: 0 });
      // const results = await Meal.find({ price: 699 }, {});
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewMeal: async (req, res, next) => {
    try {
      const meal = new Meal(req.body);
      const result = await meal.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }

    /*Or:
  If you want to use the Promise based approach*/
    /*
  const meal = new Meal({
    name: req.body.name,
    price: req.body.price
  });
  meal
    .save()
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.log(err.message);
    }); 
    */
  },

  findMealById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const meal = await Meal.findById(id);
      // const meal = await Meal.findOne({ _id: id });
      if (!meal) {
        throw createError(404, 'Meal does not exist.');
      }
      res.send(meal);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Meal id'));
        return;
      }
      next(error);
    }
  },

  updateAMeal: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
      if (updates['orders']) {
        for (const o of updates['orders']) {
          const order = new Order(o);
          await order.save()
        }
      }

      const result = await Meal.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, 'Meal does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, error.message));
      }

      next(error);
    }
  },

  pushToMeal: async (req, res, next) => {
    try { 
      // check user exists
      const user_name = formatName(req.body['order']['by'])
      req.body['order']['by'] = user_name;
      const found = await User.findOne({ name: user_name }).exec();
      if (!found) {
        // throw createError(404, 'User does not exist');
        const user = new User({ name: user_name });
        const res = await user.save();
        console.log("Created ", res)
      }
      const id = req.params.id;
      const order = new Order(req.body['order']);
      const options = { new: true };
      console.log(order)
      await order.save()
      // , 'orders.uid': {$ne: order.uid}
      const result = await Meal.findByIdAndUpdate(
        {_id: id },
        { $push: { orders: order  } }, 
        options);
      if (!result) {
        throw createError(404, 'Meal does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, error.message));
      }

      next(error);
    }
  },

  deleteAMeal: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Meal.findByIdAndDelete(id);
      // console.log(result);
      if (!result) {
        throw createError(404, 'Meal does not exist.');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Meal id'));
        return;
      }
      next(error);
    }
  },


  summarizeMeals: async (req, res, next) => {
    const meals = req.body['meals']

    let output = { total: {} }

    try {
      if (!meals) throw createError(404, 'Meals not found in body.');
      for (const i in meals) {
        const meal = meals[i]
        const result = await Meal.findByIdAndUpdate(meal['_id'], meal, { new: true });
        if (!result) {
          throw createError(404, 'Meal does not exist');
        }
        if (result['orders'])
          summarize(result, output)
      }
      res.send(output);
    } catch (error) {
      console.log(error.message)
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Meal id'));
        return;
      }
      next(error);
    }
  }
};


const sum = obj => Object.values(obj).reduce((a, b) => a + b, 0);

const summarize = (meal, output) => {
  let restaurant = {}

  meal['orders'].forEach(order => {
    if ( !([order['by']] in restaurant) ) 
      restaurant[order['by']] = order['price']
    else
      restaurant[order['by']] += order['price']
  });
  const service = + ((meal['totalFinal'] - sum(restaurant) ) / Object.keys(restaurant).length).toFixed(2)

  Object.keys(restaurant).forEach((key) => {
    restaurant[key] += service
    restaurant[key] = +restaurant[key].toFixed(2)
    key in output['total']? output['total'][key] += restaurant[key] : output['total'][key] = restaurant[key]
    output['total'][key] = +output['total'][key].toFixed(2)
  });

  restaurant['service'] = service
  output[meal['_id']] = restaurant
}
