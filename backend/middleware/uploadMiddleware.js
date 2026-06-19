const multer = require('multer');

// Configure multer to use memory storage since we will upload directly to S3
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Define allowed mimetypes or extensions if needed, for now accept all or restrict to common ones
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // If you want to accept all for flexibility, just uncomment below and remove above logic:
    // cb(null, true);
    cb(new Error('Invalid file type. Only PDF, DOCX, Images, Videos, ZIP, TXT are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

module.exports = upload;
