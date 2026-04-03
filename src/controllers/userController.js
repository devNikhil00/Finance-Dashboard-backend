const User = require('../models/User');
const sendResponse = require('../utils/apiResponse');
const isValidObjectId = require('../utils/parseObjectId');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const ALLOWED_ROLES = ['viewer', 'analyst', 'admin'];
const ALLOWED_STATUS = ['active', 'inactive'];

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });

  return sendResponse(res, 200, 'Users retrieved successfully', {
    count: users.length,
    users
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400);
  }

  if (!ALLOWED_ROLES.includes(role)) {
    throw new AppError('Role must be one of viewer, analyst, admin', 400);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendResponse(res, 200, 'User role updated successfully', user);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400);
  }

  if (!ALLOWED_STATUS.includes(status)) {
    throw new AppError('Status must be active or inactive', 400);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendResponse(res, 200, 'User status updated successfully', user);
});

module.exports = {
  listUsers,
  updateUserRole,
  updateUserStatus
};
