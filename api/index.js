const express = require('express');
const createError = require('http-errors');
const dotenv = require('dotenv').config();

const app = express();

const cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
require('./initDB')();

const UserRoute = require('./Routes/User.route');
app.use('/api/users', UserRoute);
const MealRoute = require('./Routes/Meal.route');
app.use('/api/meals', MealRoute);

// redisClient.set("Hongyi Jin", "sadzxcdtgqwradsasd");
// redisClient.expire("Hongyi Jin", 1000*60*10);

// app.get('/', async (req, res) => {
//   try {
//     const cachedResult = await redisClient.get("Hongyi Jin");
//     if (cachedResult) {
//       console.log('Data from cache.');
//       res.send(cachedResult);
//     }
//   } catch (error) {
//     console.error('Something happened to Redis', error);
//   }
// });

const MealController = require('./Controllers/Meal.Controller');
// summarize the bill for everyone
app.post('/api/summarize', MealController.summarizeMeals);


//404 handler and pass to error handler
app.use((req, res, next) => {
  /*
  const err = new Error('Not found');
  err.status = 404;
  next(err);
  */
  // You can use the above code if your not using the http-errors module
  next(createError(404, 'Not found'));
});

//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});

module.exports = app;