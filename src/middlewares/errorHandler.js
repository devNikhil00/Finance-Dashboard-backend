const sendResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

const notFound = (req, res, next) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    message = 'Invalid resource identifier';
  }

  if (err.code === 11000) {
    message = 'Duplicate value entered';
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }

  return sendResponse(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === 'production' ? null : { stack: err.stack }
  );
};

module.exports = {
  notFound,
  errorHandler
};
