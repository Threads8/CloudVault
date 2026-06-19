const express = require('express');
const router = express.Router();
const { createShareLink, getSharedFile, revokeShareLink, downloadSharedFile } = require('../controllers/shareController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createShareLink);
router.post('/:linkId/download', downloadSharedFile);
router.route('/:linkId')
  .get(getSharedFile)
  .delete(protect, revokeShareLink);

module.exports = router;
