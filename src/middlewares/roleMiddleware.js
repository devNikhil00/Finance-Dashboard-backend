const AppError = require('../utils/appError');

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }

    next();
  };
};

module.exports = allowRoles;
