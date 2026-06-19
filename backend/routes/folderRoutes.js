const express = require('express');
const router = express.Router();
const { createFolder, getFolders, renameFolder, deleteFolder, getFolderById } = require('../controllers/folderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createFolder)
  .get(protect, getFolders);

router.route('/:id')
  .get(protect, getFolderById)
  .put(protect, renameFolder)
  .delete(protect, deleteFolder);

module.exports = router;
