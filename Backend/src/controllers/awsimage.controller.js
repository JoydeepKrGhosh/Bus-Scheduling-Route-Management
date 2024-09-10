const { rekognition, s3 } = require('../utils/aws.utils.js');
const User = require('../models/user.model.js'); // Assuming user model includes conductor or driver

// Controller for start-day image upload
exports.startDay = async (req, res) => {
  try {
    const { employee_code } = req.body;
    const startDayImageKey = req.file.key; // The uploaded image key from S3

    // Save the start-day image to the user's record in the database
    await User.updateOne({ employee_code }, { startDayImageKey });

    res.status(200).json({ message: 'Start day image uploaded successfully', startDayImageKey });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading start day image', error });
  }
};

// Controller for end-day image upload and comparison
exports.endDay = async (req, res) => {
  try {
    const { employee_code } = req.body;
    const endDayImageKey = req.file.key; // The uploaded image key from S3

    // Fetch start-day image from the database
    const user = await User.findOne({ employee_code });
    const startDayImageKey = user.startDayImageKey;

    if (!startDayImageKey) {
      return res.status(400).json({ message: 'Start day image not found' });
    }

    // Fetch images from S3 for comparison
    const params = {
      SourceImage: {
        S3Object: {
          Bucket: process.env.S3_BUCKET_NAME,
          Name: startDayImageKey,
        }
      },
      TargetImage: {
        S3Object: {
          Bucket: process.env.S3_BUCKET_NAME,
          Name: endDayImageKey,
        }
      },
      SimilarityThreshold: 90
    };

    // Compare faces using AWS Rekognition
    rekognition.compareFaces(params, (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing images', err });
      }

      if (data.FaceMatches.length > 0) {
        res.status(200).json({ message: 'Faces match', similarity: data.FaceMatches[0].Similarity });
      } else {
        res.status(400).json({ message: 'Faces do not match' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading end day image', error });
  }
};
