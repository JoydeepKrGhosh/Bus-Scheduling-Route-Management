const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../utils/aws.utils.js'); // Import s3 instance from aws.js

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      const employeeCode = req.body.employee_code;
      const filename = `${employeeCode}-${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  })
});

module.exports = upload;
