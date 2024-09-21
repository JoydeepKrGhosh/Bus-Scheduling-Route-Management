import React, { useState } from "react";

const ImageUpload = ({ apiEndpoint }) => {
  const [file, setFile] = useState(null); // To store the selected image file
  const [uploadStatus, setUploadStatus] = useState(null); // To store the result of the verification
  const [error, setError] = useState(null); // To store error messages

  // Function to handle image selection
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];

    // Validate file type
    if (!selectedFile || (selectedFile.type !== "image/jpeg" && selectedFile.type !== "image/png")) {
      setError("Please upload a valid JPEG or PNG image.");
      return;
    }

    // Clear previous error and set the file
    setError(null);
    setFile(selectedFile);
  };

  // Function to upload the image
  const handleUpload = () => {
    if (!file) {
      setError("No image selected.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

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
    <div className="image-upload-container">
      <h3>Upload Image for Verification</h3>

      {/* Input for image file */}
      <input
        type="file"
        accept="image/jpeg, image/png"
        capture="environment"
        onChange={handleImageChange}
      />

      {/* Error message display */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Button to upload image */}
      <button onClick={handleUpload} disabled={!file}>
        Upload and Verify
      </button>

      {/* Display upload status */}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImageUpload;
