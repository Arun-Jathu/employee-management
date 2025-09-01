import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from '../axiosConfig';

function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    department: "",
    email: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E'
  );
  const [showRemoveImage, setShowRemoveImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setImage(file);
    setError("");
    setSuccess("");

    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(10);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 80) + 10);
      }
    };
    reader.onload = (e) => {
      setUploadProgress(100);
      setImagePreview(e.target.result);
      setShowRemoveImage(true);
      setSuccess("Photo uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    };
    reader.onerror = () => {
      setError("Error reading file. Please try again.");
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E'
    );
    setShowRemoveImage(false);
    setUploadProgress(0);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (image) data.append("image", image);

    try {
      await axios.post("/api/employees", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add employee");
    }
  };

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
          React.createElement("h2", null, "Add New Employee"),
          React.createElement(
            Link,
            { to: "/", className: "close-btn" },
            "×"
          )
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
              React.createElement("img", {
                src: imagePreview,
                alt: "Preview",
                className: imagePreview.includes("data:image/svg+xml")
                  ? "p-4 text-gray-400"
                  : "",
                onClick: () => document.getElementById("imageUpload").click()
              }),
              React.createElement(
                "div",
                {
                  className: "image-overlay",
                  onClick: () => document.getElementById("imageUpload").click()
                },
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
              showRemoveImage &&
                React.createElement(
                  "button",
                  { type: "button", onClick: removeImage, className: "remove-image" },
                  "×"
                )
            ),
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
              React.createElement(
                "button",
                {
                  type: "button",
                  onClick: () => document.getElementById("imageUpload").click(),
                  className: "btn-upload"
                },
                "📷 Choose Photo"
              ),
              showRemoveImage &&
                React.createElement(
                  "button",
                  { type: "button", onClick: removeImage, className: "btn-remove" },
                  "🗑️ Remove"
                )
            ),
            React.createElement(
              "p",
              { className: "upload-info" },
              "Supported: JPG, PNG, GIF, WebP (Max 5MB)"
            ),
            uploadProgress > 0 &&
              React.createElement(
                "div",
                { className: "progress-container" },
                React.createElement(
                  "div",
                  { className: "progress-bar" },
                  React.createElement("div", {
                    className: "progress-fill",
                    style: { width: uploadProgress + "%" }
                  })
                ),
                React.createElement("p", { className: "progress-text" }, "Uploading...")
              ),
            error && React.createElement("div", { className: "error-text" }, error),
            success && React.createElement("div", { className: "success-text" }, success)
          ),
          ["fullName", "position", "department", "email"].map((field) => {
            const labels = {
              fullName: "Full Name *",
              position: "Position *",
              department: "Department *",
              email: "Email *"
            };
            if (field === "department") {
              return React.createElement(
                "div",
                { className: "form-group", key: field },
                React.createElement("label", null, labels[field]),
                React.createElement(
                  "select",
                  {
                    name: field,
                    value: formData[field],
                    onChange: handleChange,
                    required: true
                  },
                  React.createElement("option", { value: "" }, "Select Department"),
                  ["Engineering", "Marketing", "Sales", "HR", "Finance"].map((dept) =>
                    React.createElement("option", { value: dept, key: dept }, dept)
                  )
                )
              );
            } else {
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
          React.createElement(
            "div",
            { className: "btn-group" },
            React.createElement(
              Link,
              { to: "/", className: "btn btn-cancel" },
              "Cancel"
            ),
            React.createElement(
              "button",
              { type: "submit", className: "btn btn-save" },
              "Save Employee"
            )
          )
        )
      )
    )
  );
}

export default AddEmployee;
