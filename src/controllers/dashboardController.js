const mongoose = require('mongoose');
const Record = require('../models/Record');
const sendResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const buildDashboardFacets = () => ({
  totals: [
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
          }
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
          }
        }
      }
    }
  ],
  categoryWiseTotals: [
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $sort: { totalAmount: -1, _id: 1 }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        totalAmount: 1
      }
    }
  ],
  recentTransactions: [
    {
      $sort: { date: -1, createdAt: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        _id: 1,
        amount: 1,
        type: 1,
        category: 1,
        date: 1,
        notes: 1,
        createdBy: 1
      }
    }
  ]
});

const getDashboardSummary = asyncHandler(async (req, res) => {
  const createdById = req.user?._id || req.user?.id;

  if (!createdById || !mongoose.Types.ObjectId.isValid(createdById)) {
    throw new AppError('Invalid user context', 400);
  }

  const [summary] = await Record.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(createdById)
      }
    },
    {
      $facet: buildDashboardFacets()
    }
  ]);

  const totals = summary?.totals?.[0] || {};
  const totalIncome = totals.totalIncome || 0;
  const totalExpense = totals.totalExpense || 0;

  return sendResponse(res, 200, 'Dashboard summary retrieved successfully', {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    categoryWiseTotals: summary?.categoryWiseTotals || [],
    recentTransactions: summary?.recentTransactions || []
  });
});

module.exports = {
  getDashboardSummary
};
