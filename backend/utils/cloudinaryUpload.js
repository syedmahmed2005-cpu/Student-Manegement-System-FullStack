const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");

function uploadDocument(fileBuffer, folderName) {
  return new Promise(function (resolve, reject) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: folderName,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      function (error, result) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          fileUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
}

async function deleteDocument(publicId) {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
    invalidate: true,
  });
}

module.exports = {
  uploadDocument,
  deleteDocument,
};