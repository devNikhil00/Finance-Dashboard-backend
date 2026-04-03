const User = require('../models/User');
const sendResponse = require('../utils/apiResponse');
const isValidObjectId = require('../utils/parseObjectId');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const ALLOWED_ROLES = ['viewer', 'analyst', 'admin'];
const ALLOWED_STATUS = ['active', 'inactive'];
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const filters = {};

  if (req.query.search) {
    const search = escapeRegExp(req.query.search.trim());
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const totalUsers = await User.countDocuments(filters);
  const users = await User.find(filters)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return sendResponse(res, 200, 'Users retrieved successfully', {
    page,
    limit,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit) || 1,
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
