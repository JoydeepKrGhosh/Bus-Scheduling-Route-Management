const { uploadImageToS3 } = require('../services/s3.service.js');
const { compareFaces } = require('../services/rekognition.service.js');
const Driver = require('../models/driver.model.js');
const Conductor = require('../models/conductor.model.js');
const path = require('path');

// Controller to handle reference image upload
const uploadReferenceImage = async (req, res) => {
  const { employeeCode, role } = req.body;

  // Check if the file exists using express-fileupload
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const image = req.files.image;

  try {
    const fileName = `${role}/reference-images/${employeeCode}_reference.jpg`;
    const s3Response = await uploadImageToS3(image.data, fileName);
    const s3Url = `https://${s3Response.Bucket}.s3.amazonaws.com/${s3Response.Key}`;

    // Update the reference image URL in the database
    if (role === 'driver') {
      await Driver.updateOne({ employeeCode }, { $set: { referenceImageUrl: s3Url } });
    } else if (role === 'conductor') {
      await Conductor.updateOne({ employeeCode }, { $set: { referenceImageUrl: s3Url } });
    }

    res.status(200).json({ message: 'Reference image uploaded successfully!', s3Url });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error });
  }
};

// Controller to handle daily image upload and verification
const uploadDailyImageAndVerify = async (req, res) => {
  const { employeeCode, role } = req.body;

  // Check if the file exists using express-fileupload
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const image = req.files.image;

  try {
    const fileName = `${role}/daily-uploads/${employeeCode}_${Date.now()}.jpg`;
    const s3Response = await uploadImageToS3(image.data, fileName);
    const s3Url = `https://${s3Response.Bucket}.s3.amazonaws.com/${s3Response.Key}`;

    const user = role === 'driver' ? await Driver.findOne({ employeeCode }) : await Conductor.findOne({ employeeCode });
    const referenceImageUrl = user.referenceImageUrl;
   
    // Compare faces using Rekognition
    const comparisonResult = await compareFaces(referenceImageUrl, s3Url);

    // Update the user's verification status based on the comparison result
    if (comparisonResult.FaceMatches.length > 0) {
      user.verificationStatus = 'success';
      user.lastVerifiedImage = s3Url;
    } else {
      user.verificationStatus = 'failed';
    }

    await user.save();
    res.status(200).json({ message: 'Image verified', status: user.verificationStatus });
  } catch (error) {
    res.status(500).json({ message: 'Image verification failed', error, });
  }
};

module.exports = { uploadReferenceImage, uploadDailyImageAndVerify };
