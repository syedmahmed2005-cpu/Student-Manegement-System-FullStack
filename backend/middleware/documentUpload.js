const multer = require("multer");
const path = require("path");

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
];

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".zip",
];

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 4 * 1024 * 1024,
    files: 1,
  },

  fileFilter: function (req, file, callback) {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const hasValidMimeType = allowedMimeTypes.includes(
      file.mimetype
    );

    const hasValidExtension =
      allowedExtensions.includes(extension);

    if (!hasValidMimeType || !hasValidExtension) {
      return callback(
        new Error(
          "Only PDF, DOC, DOCX, TXT and ZIP files are allowed"
        )
      );
    }

    callback(null, true);
  },
});

function documentUpload(req, res, next) {
  upload.single("file")(req, res, function (error) {
    if (!error) {
      next();
      return;
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "File size cannot exceed 4 MB",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Only one file can be uploaded",
      });
    }

    return res.status(400).json({
      message: error.message || "Invalid file upload",
    });
  });
}

module.exports = documentUpload;