const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
  ordername: {
    type: String,
    required: true
  },
  by: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
});

const MealSchema = new Schema({
  host: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  restaurant: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  orders: [orderSchema],
  totalFinal: {
    type: Number,
    default: 0
  },
  archive: {
    type: Boolean,
    default: false
  }
});

// const Meal = mongoose.model('meal', MealSchema);
// const Order = mongoose.model('order', orderSchema);
module.exports = {
  'meal': mongoose.model('meal', MealSchema),
  'order': mongoose.model('order', orderSchema)
};
