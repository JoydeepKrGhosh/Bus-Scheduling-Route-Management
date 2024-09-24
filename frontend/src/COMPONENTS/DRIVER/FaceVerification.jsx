import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import TopPopup from '../CREW MEMBER/TopPopup'; // Ensure the path is correct

const FaceVerification = ({ apiEndpoint, onComplete }) => {
  const [isCapturing, setIsCapturing] = useState(false); // To control capture state
  const [uploadStatus, setUploadStatus] = useState('');
  const webcamRef = useRef(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Controls popup visibility

  const employeeCode = 'Cd8120'; // Hardcoded employeeCode (you can replace it with dynamic code if needed)
  const role = 'conductor'; // Hardcoded role

  // Function to show the popup
  const showPopup = () => {
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false); // Hide popup after 3 seconds
    }, 3000);
  };

  // Function to capture image from webcam
  const captureImage = () => {
    showPopup(); // Show popup after upload completes
    const imageSrc = webcamRef.current.getScreenshot(); // Capture base64 image
    setIsCapturing(true); // Mark that image capture has started
    uploadImage(imageSrc); // Trigger image upload
  };

  // Function to convert base64 to Blob
  const base64ToBlob = (base64Data, contentType = 'image/jpeg') => {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  // Function to upload the captured image
  const uploadImage = async (imageSrc) => {
    try {
      if (!imageSrc || typeof imageSrc !== 'string') {
        throw new Error('No valid image data provided');
      }

      // Convert base64 image to Blob
      const imageBlob = base64ToBlob(imageSrc, 'image/jpeg');

      // Create FormData to send to the server
      const formData = new FormData();
      formData.append('image', imageBlob, 'captured-image.jpg');
      formData.append('employeeCode', employeeCode);
      formData.append('role', role);

      // Send POST request to the backend
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle server response
      if (response.data.status === 'success') {
        setUploadStatus('Image verification successful!');
        onComplete(true); // Notify parent about verification success
      } else {
        setUploadStatus('Image verification failed.');
        onComplete(false); // Notify parent about verification failure
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('Error in uploading the image');
      onComplete(false); // Notify parent about error
    } finally {
      setIsCapturing(false); // Reset capturing state
     
    }
  };

  return (
    <div style={{ textAlign: 'start' }}>
      <h1></h1>
      {/* Webcam component */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        className="rounded-lg shadow-lg"
      />
      <br />
      {/* Capture and Verify Button */}
      <button onClick={captureImage} disabled={isCapturing} className='mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg'>
        {isCapturing ? 'Uploading...' : 'Capture and Verify'}
      </button>
      
      {/* Popup for verification status */}
      <TopPopup message={uploadStatus} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

      {/* Status message display */}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FaceVerification;
