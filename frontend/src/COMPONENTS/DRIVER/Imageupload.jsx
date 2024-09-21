import React, { useEffect } from 'react';

const ImageUpload = ({ apiEndpoint, image }) => {
  const employeeCode = 'Dr1100'; // Hardcoded employeeCode
  const role = 'driver'; // Hardcoded role

  const uploadImage = async () => {
    try {
      if (!image || !(image instanceof File)) {
        throw new Error('No valid image file selected'); // Check if image is valid
      }

      // Create a FormData object
      const formData = new FormData();
      
      // Add the image (ensure the key matches what the server expects, e.g., 'file' or 'image')
      formData.append('file', image); // Use 'file' or 'image' depending on server
      formData.append('employeeCode', employeeCode);
      formData.append('role', role);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData, // Use form data instead of JSON
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
