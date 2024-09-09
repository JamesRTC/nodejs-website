const fs = require('fs');
const express = require('express');
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes.js")
const userRouter = require("./routes/userRoutes.js")
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log('I am the middleware');
  next(); 
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();  // Corrected to requestTime
  next(); 
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter); 

module.exports = app;
