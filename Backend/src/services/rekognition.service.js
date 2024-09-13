// /services/rekognitionService.js

require('dotenv').config();  // Load environment variables
const AWS = require('aws-sdk');

// Configure AWS with credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const rekognition = new AWS.Rekognition();

const compareFaces = async (sourceKey, targetKey, bucketName = process.env.S3_BUCKET) => {
  const params = {
    SourceImage: {
      S3Object: {
        Bucket: bucketName,
        Name: sourceKey,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: bucketName,
        Name: targetKey,
      },
    },
    SimilarityThreshold: 90,
  };

  return rekognition.compareFaces(params).promise();
};

module.exports = { compareFaces };
