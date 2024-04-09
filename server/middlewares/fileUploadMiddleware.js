const fs = require('fs')
const fileUpload = require('express-fileupload')

async function fileUploadMiddleware(req, res, next) {
  const tempDir = '/tmp'

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
  }

  fileUpload({
    useTempFiles: true,
    tempFileDir: tempDir,
  })(req, res, next)
}

module.exports = fileUploadMiddleware
