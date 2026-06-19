const File = require('../models/File');
const Activity = require('../models/Activity');
const crypto = require('crypto');
const { containerClient, blobServiceClient } = require('../config/azure');
const { generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');

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

// @desc    Create share link for a file
// @route   POST /api/share/create
// @access  Private
const createShareLink = async (req, res, next) => {
  try {
    const { fileId, isPublic, password, expiresAt, downloadLimit } = req.body;

    const file = await File.findOne({ _id: fileId, owner: req.user._id });
    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    const linkId = crypto.randomUUID().replace(/-/g, '').substring(0, 10);

    file.shareLink = {
      linkId,
      isPublic: isPublic !== undefined ? isPublic : true,
      password: password || undefined, // in a real app, hash this password
      expiresAt: expiresAt || null,
      downloadLimit: downloadLimit || null,
      downloads: 0
    };

    await file.save();

    await Activity.create({
      user: req.user._id,
      action: 'share',
      target: file.fileName
    });

    res.json({ linkId: file.shareLink.linkId, message: 'Share link created' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get file via share link
// @route   GET /api/share/:linkId
// @access  Public
const getSharedFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ 'shareLink.linkId': req.params.linkId });
    if (!file) {
      res.status(404);
      throw new Error('Shared file not found');
    }

    // Check expiration
    if (file.shareLink.expiresAt && new Date() > file.shareLink.expiresAt) {
      res.status(403);
      throw new Error('Share link has expired');
    }

    // Check download limit
    if (file.shareLink.downloadLimit && file.shareLink.downloads >= file.shareLink.downloadLimit) {
      res.status(403);
      throw new Error('Download limit reached');
    }

    // Return file metadata (frontend can request download URL using S3 directly or another endpoint if password protected)
    res.json({
      fileName: file.fileName,
      fileSize: file.fileSize,
      fileType: file.fileType,
      isPasswordProtected: !!file.shareLink.password
      // NOTE: We don't return s3Key here. We would generate a presigned URL if they pass the password or if it's public.
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke share link
// @route   DELETE /api/share/:linkId
// @access  Private
const revokeShareLink = async (req, res, next) => {
  try {
    const file = await File.findOne({ 'shareLink.linkId': req.params.linkId, owner: req.user._id });
    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    file.shareLink = undefined;
    await file.save();

    res.json({ message: 'Share link revoked' });
  } catch (error) {
    next(error);
  }
};

// @desc    Download shared file
// @route   POST /api/share/:linkId/download
// @access  Public
const downloadSharedFile = async (req, res, next) => {
  try {
    const { password } = req.body;
    const file = await File.findOne({ 'shareLink.linkId': req.params.linkId });
    
    if (!file) {
      res.status(404);
      throw new Error('Shared file not found');
    }

    // Check expiration
    if (file.shareLink.expiresAt && new Date() > file.shareLink.expiresAt) {
      res.status(403);
      throw new Error('Share link has expired');
    }

    // Check download limit
    if (file.shareLink.downloadLimit && file.shareLink.downloads >= file.shareLink.downloadLimit) {
      res.status(403);
      throw new Error('Download limit reached');
    }

    // Check password
    if (file.shareLink.password && file.shareLink.password !== password) {
      res.status(401);
      throw new Error('Invalid password');
    }

    // Increment download count
    file.shareLink.downloads += 1;
    await file.save();

    // Generate Azure SAS URL
    const signedUrl = generateSasToken(file.s3Key);

    res.json({ url: signedUrl, fileName: file.fileName });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShareLink,
  getSharedFile,
  revokeShareLink,
  downloadSharedFile
};
