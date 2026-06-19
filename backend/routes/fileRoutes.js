const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, downloadFile, deleteFile, renameFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getFiles)
  .post(protect, upload.single('file'), uploadFile);

router.route('/:id')
  .delete(protect, deleteFile)
  .put(protect, renameFile);

router.get('/:id/download', protect, downloadFile);

module.exports = router;
