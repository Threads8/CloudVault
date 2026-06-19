const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['upload', 'download', 'delete', 'share', 'login', 'create_folder', 'delete_folder', 'rename_file', 'rename_folder']
  },
  target: {
    type: String, // e.g., filename, folder name, or 'system'
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
