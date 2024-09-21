import React, { useEffect } from 'react';

// Helper function to convert base64 to Blob
const base64ToBlob = (base64Data, contentType = 'image/jpeg') => {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

const ImageUpload = ({ apiEndpoint, image }) => {
  const employeeCode = 'Dr1100'; // Hardcoded employeeCode
  const role = 'driver'; // Hardcoded role

  const uploadImage = async () => {
    try {
      if (!image || typeof image !== 'string') {
        throw new Error('No valid image data provided'); // Check if image is a base64 string
      }

      // Convert the base64 image to a Blob
      const imageBlob = base64ToBlob(image, 'image/jpeg');

      // Create a FormData object
      const formData = new FormData();
      
      // Append the Blob as a 'file'
      formData.append('image', imageBlob, 'captured-image.jpg'); // 'file' should match the expected field name on the server
      formData.append('employeeCode', employeeCode);
      formData.append('role', role);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData, // Send form data
      });

      // Handle non-JSON responses by checking the Content-Type
      let result;
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text(); // Handle plain text or other formats
        throw new Error(result); // Throw an error to handle this as a failed request
      }

      // Handle the verification result here
      if (result.match) {
        alert('Image verification successful!');
        console.log('Image verification successful!');
      } else {
        alert('Image verification failed!');
        console.log('Image verification failed!');
        window.close(); // Close the window if verification fails
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error: ${error.message}`);
      window.close(); // Close the window on any error
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage(); // Automatically upload the image after it's captured
    }
  }, [image, apiEndpoint]);

  return null; // No UI for this component
};

export default ImageUpload;
