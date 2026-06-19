const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  s3Key: {
    type: String,
    required: true
  },
  s3Url: {
    type: String
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  versions: [{
    version: Number,
    s3Key: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  shareLink: {
    linkId: String,
    isPublic: { type: Boolean, default: false },
    password: { type: String, select: false },
    expiresAt: Date,
    downloads: { type: Number, default: 0 },
    downloadLimit: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
