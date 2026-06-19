const File = require('../models/File');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { containerClient, blobServiceClient } = require('../config/azure');
const { generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

// Helper to generate SAS Token for Azure Blob
const generateSasToken = (blobName) => {
  const sasOptions = {
    containerName: containerClient.containerName,
    blobName: blobName,
    permissions: BlobSASPermissions.parse("r"), // read permission
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    blobServiceClient.credential
  ).toString();

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  return `${blockBlobClient.url}?${sasToken}`;
};

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    let { folderId } = req.body;
    if (folderId === 'null' || folderId === 'undefined' || !folderId) {
      folderId = null;
    }
    const fileName = req.file.originalname;
    
    // Check if file with same name exists for versioning
    let existingFile = await File.findOne({ owner: req.user._id, fileName, folderId });

    const azureBlobName = `uploads/${req.user._id}/${uuidv4()}-${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(azureBlobName);

    // Upload to Azure
    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype }
    });

    let savedFile;

    if (existingFile) {
      // New version
      const newVersion = existingFile.versions.length + 1;
      existingFile.versions.push({
        version: newVersion,
        s3Key: azureBlobName // Keeping schema field as s3Key to avoid migration, but it stores Azure blob name
      });
      existingFile.s3Key = azureBlobName; // Set latest key
      existingFile.fileSize = req.file.size;
      savedFile = await existingFile.save();
    } else {
      // New file
      savedFile = await File.create({
        owner: req.user._id,
        fileName,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        s3Key: azureBlobName,
        folderId: folderId || null,
        versions: [{ version: 1, s3Key: azureBlobName }]
      });
    }

    // Update user storage used
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: req.file.size }
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'upload',
      target: fileName
    });

    res.status(201).json(savedFile);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all files for user
// @route   GET /api/files
// @access  Private
const getFiles = async (req, res, next) => {
  try {
    let { folderId } = req.query;
    const query = { owner: req.user._id };
    
    if (folderId && folderId !== 'null' && folderId !== 'undefined') {
      query.folderId = folderId;
    } else {
      query.folderId = null; // root level
    }

    const files = await File.find(query).sort({ createdAt: -1 });
    
    res.json(files);
  } catch (error) {
    next(error);
  }
};

// @desc    Get signed URL for downloading/previewing a file
// @route   GET /api/files/:id/download
// @access  Private
const downloadFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    // Generate Azure SAS URL
    const signedUrl = generateSasToken(file.s3Key);

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'download',
      target: file.fileName
    });

    res.json({ url: signedUrl });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    // Delete all versions from Azure
    for (const v of file.versions) {
      try {
        const blockBlobClient = containerClient.getBlockBlobClient(v.s3Key);
        await blockBlobClient.deleteIfExists();
      } catch (err) {
        console.error(`Error deleting ${v.s3Key} from Azure:`, err);
        // Continue even if one version fails to delete
      }
    }

    // Update user storage used
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: -file.fileSize } 
    });

    await file.deleteOne();

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'delete',
      target: file.fileName
    });

    res.json({ id: req.params.id, message: 'File deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Rename a file
// @route   PUT /api/files/:id
// @access  Private
const renameFile = async (req, res, next) => {
  try {
    const { newName } = req.body;
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    file.fileName = newName;
    await file.save();

    await Activity.create({
      user: req.user._id,
      action: 'rename_file',
      target: newName
    });

    res.json(file);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  renameFile
};
