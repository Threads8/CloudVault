const express = require('express');
const router = express.Router();
const { getStorageAnalytics, getActivityLogs } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/storage', protect, getStorageAnalytics);
router.get('/activity', protect, getActivityLogs);

module.exports = router;
