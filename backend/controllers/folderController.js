const Folder = require('../models/Folder');
const File = require('../models/File');
const Activity = require('../models/Activity');

// @desc    Create a new folder
// @route   POST /api/folders
// @access  Private
const createFolder = async (req, res, next) => {
  try {
    const { folderName, parentFolder } = req.body;

    if (!folderName) {
      res.status(400);
      throw new Error('Please provide a folder name');
    }

    let parentFolderId = parentFolder;
    if (parentFolderId === 'null' || parentFolderId === 'undefined' || !parentFolderId) {
      parentFolderId = null;
    }

    const folder = await Folder.create({
      owner: req.user._id,
      folderName,
      parentFolder: parentFolderId
    });

    await Activity.create({
      user: req.user._id,
      action: 'create_folder',
      target: folderName
    });

    res.status(201).json(folder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all folders for a user
// @route   GET /api/folders
// @access  Private
const getFolders = async (req, res, next) => {
  try {
    const { parentFolder } = req.query;
    
    const query = { owner: req.user._id };
    if (parentFolder && parentFolder !== 'null' && parentFolder !== 'undefined') {
      query.parentFolder = parentFolder;
    } else {
      query.parentFolder = null; // Get root folders
    }

    const folders = await Folder.find(query).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    next(error);
  }
};

// @desc    Rename a folder
// @route   PUT /api/folders/:id
// @access  Private
const renameFolder = async (req, res, next) => {
  try {
    const { folderName } = req.body;
    
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id });
    if (!folder) {
      res.status(404);
      throw new Error('Folder not found');
    }

    folder.folderName = folderName;
    await folder.save();

    await Activity.create({
      user: req.user._id,
      action: 'rename_folder',
      target: folderName
    });

    res.json(folder);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a folder
// @route   DELETE /api/folders/:id
// @access  Private
const deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id });
    if (!folder) {
      res.status(404);
      throw new Error('Folder not found');
    }

    // In a real application, you might want to recursively delete all child folders
    // and files inside them, OR prevent deletion if it's not empty.
    // For simplicity, let's just delete the folder itself if it's empty, or you can implement recursive deletion.
    
    // Check if folder is empty
    const filesInFolder = await File.find({ folderId: folder._id });
    const subFolders = await Folder.find({ parentFolder: folder._id });

    if (filesInFolder.length > 0 || subFolders.length > 0) {
      res.status(400);
      throw new Error('Folder is not empty. Please delete its contents first.');
    }

    await folder.deleteOne();

    await Activity.create({
      user: req.user._id,
      action: 'delete_folder',
      target: folder.folderName
    });

    res.json({ id: req.params.id, message: 'Folder deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get folder details and its parent lineage path for breadcrumbs
// @route   GET /api/folders/:id
// @access  Private
const getFolderById = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id });
    if (!folder) {
      res.status(404);
      throw new Error('Folder not found');
    }

    const path = [];
    let current = folder;
    while (current) {
      path.unshift({
        _id: current._id,
        folderName: current.folderName,
        parentFolder: current.parentFolder
      });
      if (current.parentFolder) {
        current = await Folder.findOne({ _id: current.parentFolder, owner: req.user._id });
      } else {
        current = null;
      }
    }

    res.json({ folder, path });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder,
  getFolderById
};
