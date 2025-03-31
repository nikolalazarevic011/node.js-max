const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Set up storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // saved to /images
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // unique filename
  }
});

// Filter for image types only
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter });

module.exports = upload;
