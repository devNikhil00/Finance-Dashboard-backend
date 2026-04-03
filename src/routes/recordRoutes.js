const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');

router.use(authMiddleware);

router.get('/', getRecords);
router.post('/', allowRoles('admin'), createRecord);
router.put('/:id', allowRoles('admin'), updateRecord);
router.delete('/:id', allowRoles('admin'), deleteRecord);

module.exports = router;
