const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const {
  listUsers,
  updateUserRole,
  updateUserStatus
} = require('../controllers/userController');

router.use(authMiddleware, allowRoles('admin'));

router.get('/', listUsers);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/status', updateUserStatus);

module.exports = router;
