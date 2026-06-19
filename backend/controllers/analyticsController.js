const File = require('../models/File');
const Activity = require('../models/Activity');

// @desc    Get storage analytics
// @route   GET /api/analytics/storage
// @access  Private
const getStorageAnalytics = async (req, res, next) => {
  try {
    const files = await File.find({ owner: req.user._id });
    
    let totalStorageUsed = 0;
    let fileCount = files.length;
    let types = {
      image: 0,
      document: 0,
      video: 0,
      archive: 0,
      other: 0
    };

    files.forEach(file => {
      totalStorageUsed += file.fileSize;
      
      if (file.fileType.startsWith('image/')) {
        types.image++;
      } else if (file.fileType.startsWith('video/')) {
        types.video++;
      } else if (file.fileType.includes('pdf') || file.fileType.includes('document')) {
        types.document++;
      } else if (file.fileType.includes('zip') || file.fileType.includes('rar') || file.fileType.includes('tar')) {
        types.archive++;
      } else {
        types.other++;
      }
    });

    res.json({
      totalStorageUsed,
      totalStorageLimit: 15 * 1024 * 1024 * 1024, // Assuming 15GB limit for example
      fileCount,
      types
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activity
// @route   GET /api/analytics/activity
// @access  Private
const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStorageAnalytics,
  getActivityLogs
};
