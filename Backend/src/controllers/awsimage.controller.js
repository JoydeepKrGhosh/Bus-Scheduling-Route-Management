const { uploadImageToS3 } = require('../services/s3.service.js');
const { compareFaces } = require('../services/rekognition.service.js');
const Driver = require('../models/driver.model.js');
const Conductor = require('../models/conductor.model.js');
const path = require('path');
const fs = require('fs');

// Controller to handle reference image upload
const uploadReferenceImage = async (req, res) => {
  const { employeeCode, role } = req.body;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.image; // Ensure 'image' matches the file key from the frontend
  console.log('File uploaded:', file);

  const tempFilePath = path.join(__dirname, '../../tmp', file.name);
  
  // Move the file to the tmp directory
  file.mv(tempFilePath, async (err) => {
    if (err) {
      console.error('File move error:', err);
      return res.status(500).json({ message: 'Failed to move the file', error: err });
    }

    // Read the file after it's been moved
    fs.readFile(tempFilePath, async (err, imageBuffer) => {
      if (err) {
        console.error('File read error:', err);
        return res.status(500).json({ message: 'Failed to read the file', error: err });
      }

      console.log('Image Data Buffer Length:', imageBuffer.length);

      if (Buffer.byteLength(imageBuffer) === 0) {
        return res.status(400).json({ message: 'Uploaded file is empty' });
      }

      try {
        const fileName = `${role}/reference-images/${employeeCode}_reference.jpg`;
        const s3Response = await uploadImageToS3(imageBuffer, fileName);
        console.log('S3 Upload Response:', s3Response);
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
    });
  });
};

const uploadDailyImageAndVerify = async (req, res) => {
  const { employeeCode, role } = req.body;

  // Check if the file exists using express-fileupload
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.image; // Ensure 'image' matches the file key from the frontend
  console.log('File uploaded:', file);

  const tempFilePath = path.join(__dirname, '../../tmp', file.name);
  let referenceImageUrl;  // Declare referenceImageUrl outside the try block
  let s3Url;  // Declare s3Url outside the try block

  // Move the file to the tmp directory
  file.mv(tempFilePath, async (err) => {
    if (err) {
      console.error('File move error:', err);
      return res.status(500).json({ message: 'Failed to move the file', error: err });
    }

    // Read the file after it's been moved
    fs.readFile(tempFilePath, async (err, imageBuffer) => {
      if (err) {
        console.error('File read error:', err);
        return res.status(500).json({ message: 'Failed to read the file', error: err });
      }

      // Use the imageBuffer for S3 upload
      try {
        const fileName = `${role}/daily-uploads/${employeeCode}_${Date.now()}.jpg`;
        const s3Response = await uploadImageToS3(imageBuffer, fileName); // Use imageBuffer here
        s3Url = `https://${s3Response.Bucket}.s3.amazonaws.com/${s3Response.Key}`;

        const user = role === 'driver' ? await Driver.findOne({ employeeCode }) : await Conductor.findOne({ employeeCode });
        referenceImageUrl = user.referenceImageUrl;  // Assign value to referenceImageUrl

        // Compare faces using Rekognition
        console.log('Reference Image URL:', referenceImageUrl);
        console.log('Daily Image URL:', s3Url);

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
        // Enhanced error handling block with referenceImageUrl and s3Url now available
        console.error("Image verification failed:", error);
        res.status(500).json({
          message: 'Image verification failed',
          error: {
            message: error.message,
            requestId: error.requestId,
            statusCode: error.statusCode,
            code: error.code
          },
          s3Details: {
            referenceImageUrl,
            dailyImageUrl: s3Url,
          }
        });
      }
    });
  });
};


module.exports = { uploadReferenceImage, uploadDailyImageAndVerify };
