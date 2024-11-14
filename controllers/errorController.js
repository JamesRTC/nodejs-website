const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  const appError = new AppError(message, 400);
  return appError;
};

// const handleDuplicateFieldDB = (err) => {
//   // const value = err.keyValue ? JSON.stringify(err.keyValue) : 'unknown value';
//   const message = `Duplicate field value. Please use another value.`;
//   return new AppError(message, 400);
// };

const handleValidationErrorDB = (err) => {
  const message = `invalid input data: ${err.message}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational error, trusted to send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error: don't leak details
    // console.error('ERROR 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    // error.code = 11000;

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    // if (error.name === 'ValidationError') error = handleDuplicateFieldDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
