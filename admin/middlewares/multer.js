const multer = require("multer");
const storage = multer.memoryStorage();
const uploadSingleFile = multer({ storage: storage }).single("file");
const uploadMultipleFiles = multer({ storage }).array("files", 10);
module.exports = { 
    uploadSingleFile,
    uploadMultipleFiles,
};