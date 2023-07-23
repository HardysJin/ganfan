const createError = require('http-errors');
const mongoose = require('mongoose');

const User = require('../Models/User.model');

const formatName = (tmp_name) => {
  const arr = tmp_name.split(" ");
  arr.forEach(function (item, i) {
    arr[i] = item.charAt(0).toUpperCase() + item.slice(1);
  });
  const name = arr.join(" ");
  return name;
}

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const results = await User.find({}, { __v: 0 });
      // const results = await User.find({}, { name: 1, price: 1, _id: 0 });
      // const results = await User.find({ price: 699 }, {});
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  formatName: formatName,

  createNewUser: async (req, res, next) => {
    try {
      const name = formatName(req.body['name']);
      const found = await User.findOne({ name: name }).exec();
      if (found) {
        res.send(found);
        return;
      }

      const user = new User(req.body);
      const result = await user.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findUserById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      // const user = await User.findOne({ _id: id });
      if (!user) {
        throw createError(404, 'User does not exist.');
      }
      res.send(user);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid User id'));
        return;
      }
      next(error);
    }
  },

  updateAUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };

      const result = await User.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, 'User does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid User Id'));
      }

      next(error);
    }
  },

  deleteAUser: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await User.findByIdAndDelete(id);
      // console.log(result);
      if (!result) {
        throw createError(404, 'User does not exist.');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid User id'));
        return;
      }
      next(error);
    }
  }
};
