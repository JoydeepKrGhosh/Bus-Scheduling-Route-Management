import React, { useState } from "react";

const ImageUpload = ({ apiEndpoint, imageSrc }) => {
  const [uploadStatus, setUploadStatus] = useState(null); // To store the result of the verification
  const [error, setError] = useState(null); // To store error messages

  // Function to upload the image
  const handleUpload = () => {
    // Convert base64 to Blob
    const byteString = atob(imageSrc.split(',')[1]);
    const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const file = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append("image", file, 'capturedImage.jpg');

    // Call the API to upload and verify the image
    fetch(apiEndpoint, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.verified) {
          setUploadStatus("Image verified successfully.");
        } else {
          setUploadStatus("Image verification failed.");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        setUploadStatus("An error occurred while uploading the image.");
      });
  };

  return (
    <div className="image-upload-container mt-4">
      <h3>Upload Image for Verification</h3>

      {/* Button to upload image */}
      <button onClick={handleUpload} className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg">
        Upload and Verify
      </button>

      {/* Display upload status */}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImageUpload;
