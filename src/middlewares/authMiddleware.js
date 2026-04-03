const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    throw new AppError('Not authorized, token missing', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Not authorized, token invalid', 401);
  }

  const user = await User.findById(decoded.userId).select('-password');

  if (!user) {
    throw new AppError('Not authorized, user not found', 401);
  }

  if (user.status === 'inactive') {
    throw new AppError('User is inactive', 403);
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;
