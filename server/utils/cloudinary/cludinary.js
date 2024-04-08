const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

async function uploadImage(filePath, folder) {
  const response = await cloudinary.uploader.upload(filePath, { folder })
  return response
}

async function deleteImage(public_id) {
  const response = await cloudinary.uploader.destroy(public_id)
  return response
}

module.exports = {
  uploadImage,
  deleteImage,
}
