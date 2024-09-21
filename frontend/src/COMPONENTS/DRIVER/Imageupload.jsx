import React, { useEffect } from 'react';

const ImageUpload = ({ apiEndpoint, image }) => {
  useEffect(() => {
    const uploadImage = async () => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: image }), // Send the image in base64 format
        });

        const result = await response.json();
        // Handle the verification result here
        if (result.match) {
          alert('Image verification successful!');
          console.log('Image verification successful!');
        } else {
          alert('Image verification failed!');
          console.log('Image verification not successful!');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    if (image) {
      uploadImage(); // Automatically upload the image after it's captured
    }
  }, [image, apiEndpoint]);

  return null; // No UI for this component
};

export default ImageUpload;
