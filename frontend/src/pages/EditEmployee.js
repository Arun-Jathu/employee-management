import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from '../axiosConfig';

// Imports React for component creation, useState and useEffect for state and lifecycle management,
// react-router-dom for routing, and axios for API requests

/**
 * EditEmployee component for updating an existing employee's details
 */
function EditEmployee() {
  // Extract employee ID from URL parameters
  const { id } = useParams();
  // Initialize navigation hook for redirecting after form submission
  const navigate = useNavigate();

  // State for form data (employee details)
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    department: "",
    email: "",
  });

  // State for image file, preview, and upload status
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    // Default SVG placeholder for image preview
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E'
  );
  const [showRemoveImage, setShowRemoveImage] = useState(false); // Toggle remove image button
  const [uploadProgress, setUploadProgress] = useState(0); // Track image upload progress
  const [error, setError] = useState(""); // Store error messages
  const [success, setSuccess] = useState(""); // Store success messages

  /**
   * Fetch employee data on component mount or ID change
   */
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        // Fetch employee data from API
        const response = await axios.get(`/api/employees/${id}`);
        // Populate form with existing employee data
        setFormData({
          fullName: response.data.fullName,
          position: response.data.position,
          department: response.data.department,
          email: response.data.email,
        });
        // Set image preview if employee has an image
        if (response.data.image) {
          setImagePreview(`http://localhost:5000/${response.data.image}`);
          setShowRemoveImage(true);
        }
      } catch (err) {
        // Handle fetch errors
        setError("Failed to fetch employee");
        console.error(err);
      }
    };
    fetchEmployee();
  }, [id]); // Re-run when employee ID changes

  /**
   * Handle changes to form input fields
   */
  const handleChange = (e) => {
    // Update form data state with new input value
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle image file selection and preview
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; // Exit if no file selected

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Set image state and clear previous messages
    setImage(file);
    setError("");
    setSuccess("");

    // Create FileReader for image preview
    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(10); // Start progress at 10%
    reader.onprogress = (e) => {
      // Update progress based on file reading
      if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 80) + 10);
    };
    reader.onload = (e) => {
      // Set preview image, show remove button, and display success message
      setUploadProgress(100);
      setImagePreview(e.target.result);
      setShowRemoveImage(true);
      setSuccess("Photo uploaded successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    };
    reader.onerror = () => {
      // Handle file reading errors
      setError("Error reading file. Please try again.");
      setUploadProgress(0);
    };
    reader.readAsDataURL(file); // Read file as data URL for preview
  };

  /**
   * Remove selected image and reset preview
   */
  const removeImage = () => {
    // Clear image state and reset to default SVG placeholder
    setImage(null);
    setImagePreview(
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E'
    );
    setShowRemoveImage(false); // Hide remove button
    setUploadProgress(0); // Reset progress
    setError(""); // Clear error
    setSuccess(""); // Clear success
  };

  /**
   * Handle form submission to update employee
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Create FormData for multipart/form-data request
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (image) data.append("image", image); // Append image if selected

    try {
      // Send PUT request to update employee
      await axios.put(`/api/employees/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Redirect to employee details page on success
      navigate(`/employee/${id}`);
    } catch (error) {
      // Display error from server or generic message
      setError(error.response?.data?.error || "Failed to update employee");
    }
  };

  // Rendering modal with employee edit form
  return React.createElement(
    "div",
    { className: "modal-backdrop" },
    React.createElement(
      "div",
      { className: "modal" },
      React.createElement(
        "div",
        { className: "modal-content" },
        React.createElement(
          "div",
          { className: "modal-header" },
          React.createElement("h2", null, "Edit Employee"),
          // Close button redirects to employee details page
          React.createElement(Link, { to: `/employee/${id}`, className: "close-btn" }, "×")
        ),
        React.createElement(
          "form",
          { onSubmit: handleSubmit },
          React.createElement(
            "div",
            { className: "image-upload" },
            React.createElement(
              "div",
              { className: "image-container" },
              // Display image preview or placeholder
              React.createElement("img", {
                src: imagePreview,
                alt: "Preview",
                className: imagePreview.includes("data:image/svg+xml") ? "p-4 text-gray-400" : "",
                onClick: () => document.getElementById("imageUpload").click()
              }),
              React.createElement(
                "div",
                {
                  className: "image-overlay",
                  onClick: () => document.getElementById("imageUpload").click()
                },
                // SVG icon for image upload
                React.createElement(
                  "svg",
                  { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                  React.createElement("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  }),
                  React.createElement("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  })
                )
              ),
              // Show remove button if image is selected
              showRemoveImage &&
                React.createElement(
                  "button",
                  { type: "button", onClick: removeImage, className: "remove-image" },
                  "×"
                )
            ),
            // Hidden file input for image selection
            React.createElement("input", {
              type: "file",
              id: "imageUpload",
              accept: "image/jpeg,image/jpg,image/png,image/gif,image/webp",
              onChange: handleImageChange,
              style: { display: "none" }
            }),
            React.createElement(
              "div",
              { className: "upload-buttons" },
              // Button to trigger file input
              React.createElement(
                "button",
                {
                  type: "button",
                  onClick: () => document.getElementById("imageUpload").click(),
                  className: "btn-upload"
                },
                "📷 Choose Photo"
              ),
              // Remove button shown only if image is selected
              showRemoveImage &&
                React.createElement(
                  "button",
                  { type: "button", onClick: removeImage, className: "btn-remove" },
                  "🗑️ Remove"
                )
            ),
            // Display supported file types and size limit
            React.createElement("p", { className: "upload-info" }, "Supported: JPG, PNG, GIF, WebP (Max 5MB)"),
            // Showing progress bar during image upload
            uploadProgress > 0 &&
              React.createElement(
                "div",
                { className: "progress-container" },
                React.createElement(
                  "div",
                  { className: "progress-bar" },
                  React.createElement("div", { className: "progress-fill", style: { width: uploadProgress + "%" } })
                ),
                React.createElement("p", { className: "progress-text" }, "Uploading...")
              ),
            // Error messages
            error && React.createElement("div", { className: "error-text" }, error),
            success && React.createElement("div", { className: "success-text" }, success)
          ),
          // Dynamically render form fields for fullName, position, department, email
          ["fullName", "position", "department", "email"].map((field) => {
            const labels = { fullName: "Full Name *", position: "Position *", department: "Department *", email: "Email *" };
            if (field === "department") {
              // Rendering select dropdown for department
              return React.createElement(
                "div",
                { className: "form-group", key: field },
                React.createElement("label", null, labels[field]),
                React.createElement(
                  "select",
                  { name: field, value: formData[field], onChange: handleChange, required: true },
                  React.createElement("option", { value: "" }, "Select Department"),
                  ["Engineering", "Marketing", "Sales", "HR", "Finance"].map((dept) =>
                    React.createElement("option", { value: dept, key: dept }, dept)
                  )
                )
              );
            } else {
              // Rendering text or email input for other fields
              return React.createElement(
                "div",
                { className: "form-group", key: field },
                React.createElement("label", null, labels[field]),
                React.createElement("input", {
                  type: field === "email" ? "email" : "text",
                  name: field,
                  value: formData[field],
                  onChange: handleChange,
                  placeholder: "Enter " + labels[field].replace(" *", "").toLowerCase(),
                  required: true
                })
              );
            }
          }),
          // Rendering Cancel and Save buttons
          React.createElement(
            "div",
            { className: "btn-group" },
            React.createElement(Link, { to: `/employee/${id}`, className: "btn btn-cancel" }, "Cancel"),
            React.createElement("button", { type: "submit", className: "btn btn-save" }, "Save Employee")
          )
        )
      )
    )
  );
}

export default EditEmployee;