const router = require('express').Router();
const authRoutes = require('./authRoutes');
const recordRoutes = require('./recordRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const userRoutes = require('./userRoutes');
const sendResponse = require('../utils/apiResponse');

router.get('/health', (req, res) => {
  return sendResponse(res, 200, 'Finance Dashboard API is running');
});

router.use('/auth', authRoutes);
router.use('/records', recordRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

module.exports = router;
