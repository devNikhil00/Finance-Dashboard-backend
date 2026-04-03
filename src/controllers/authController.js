const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const buildUserResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const token = signToken(user._id);

  return sendResponse(res, 201, 'User registered successfully', buildUserResponse(user, token));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (user.status !== 'active') {
    throw new AppError('User account is inactive', 403);
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signToken(user._id);

  return sendResponse(res, 200, 'Login successful', buildUserResponse(user, token));
});

module.exports = {
  registerUser,
  loginUser
};
