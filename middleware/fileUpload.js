// const multer = require("multer");

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// // 🔁 Store image in memory (not in 'images/' folder)
// const storage = multer.memoryStorage();

// module.exports = multer({ storage: storage, fileFilter: fileFilter });

// middleware/fileUpload.js
const multer = require('multer');

const storage = multer.memoryStorage(); // 🔴 not diskStorage()
const upload = multer({ storage });

module.exports = upload;
