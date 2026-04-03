const Record = require('../models/Record');
const sendResponse = require('../utils/apiResponse');
const isValidObjectId = require('../utils/parseObjectId');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const isValidDateValue = (value) => !Number.isNaN(new Date(value).getTime());
const isValidAmount = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const canModifyRecord = (user) => user?.role === 'admin';

const buildRecordFilters = (query) => {
  const filters = {};

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filters.date = {};

    if (query.startDate) {
      if (!isValidDateValue(query.startDate)) {
        return { error: 'startDate must be a valid date' };
      }
      filters.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      if (!isValidDateValue(query.endDate)) {
        return { error: 'endDate must be a valid date' };
      }
      filters.date.$lte = new Date(query.endDate);
    }
  }

  return filters;
};

const createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  if (!canModifyRecord(req.user)) {
    throw new AppError('Only admin can modify records', 403);
  }

  if (amount === undefined || !type || !category) {
    throw new AppError('Amount, type, and category are required', 400);
  }

  if (!isValidAmount(amount)) {
    throw new AppError('Amount must be a positive number', 400);
  }

  if (!['income', 'expense'].includes(type)) {
    throw new AppError('Type must be income or expense', 400);
  }

  const record = await Record.create({
    amount: Number(amount),
    type,
    category,
    date,
    notes,
    createdBy: req.user._id
  });

  return sendResponse(res, 201, 'Record created successfully', record);
});

const getRecords = asyncHandler(async (req, res) => {
  const filters = buildRecordFilters(req.query);

  if (filters.error) {
    throw new AppError(filters.error, 400);
  }

  filters.createdBy = req.user._id;

  const records = await Record.find(filters)
    .populate('createdBy', 'name email role')
    .sort({ date: -1, createdAt: -1 });

  return sendResponse(res, 200, 'Records retrieved successfully', {
    count: records.length,
    records
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, date, notes } = req.body;

  if (!canModifyRecord(req.user)) {
    throw new AppError('Only admin can modify records', 403);
  }

  if (!isValidObjectId(id)) {
    throw new AppError('Invalid record id', 400);
  }

  const record = await Record.findById(id);

  if (!record) {
    throw new AppError('Record not found', 404);
  }

  if (amount !== undefined) {
    if (!isValidAmount(amount)) {
      throw new AppError('Amount must be a positive number', 400);
    }

    record.amount = Number(amount);
  }

  if (type !== undefined) {
    if (!['income', 'expense'].includes(type)) {
      throw new AppError('Type must be income or expense', 400);
    }
    record.type = type;
  }

  if (category !== undefined) record.category = category;
  if (date !== undefined) record.date = date;
  if (notes !== undefined) record.notes = notes;

  const updatedRecord = await record.save();

  return sendResponse(res, 200, 'Record updated successfully', updatedRecord);
});

const deleteRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!canModifyRecord(req.user)) {
    throw new AppError('Only admin can modify records', 403);
  }

  if (!isValidObjectId(id)) {
    throw new AppError('Invalid record id', 400);
  }

  const record = await Record.findByIdAndDelete(id);

  if (!record) {
    throw new AppError('Record not found', 404);
  }

  return sendResponse(res, 200, 'Record deleted successfully');
});

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
