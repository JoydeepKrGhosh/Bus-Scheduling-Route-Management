// /services/s3Service.js

require('dotenv').config();  // Load environment variables
const AWS = require('aws-sdk');

// Configure AWS with credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (imageBuffer, key, bucketName = process.env.S3_BUCKET) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };
  return s3.upload(params).promise();
};

module.exports = { uploadImageToS3 };





