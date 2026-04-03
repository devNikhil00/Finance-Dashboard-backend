const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const { getDashboardSummary } = require('../controllers/dashboardController');

router.get('/summary', authMiddleware, allowRoles('analyst', 'admin'), getDashboardSummary);

module.exports = router;
