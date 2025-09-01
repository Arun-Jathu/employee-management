import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function EditEmployee() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`/api/employees/${id}`);
        setFormData({
          fullName: response.data.fullName,
          position: response.data.position,
          department: response.data.department,
          email: response.data.email,
        });
        if (response.data.image) {
          setImagePreview(`http://localhost:5000/${response.data.image}`);
          setShowRemoveImage(true);
        }
      } catch (err) {
        setError("Failed to fetch employee");
        console.error(err);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
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
      await axios.put(`/api/employees/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/employee/${id}`);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update employee");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Edit Employee</h2>
            <Link to={`/employee/${id}`} className="close-btn">
              ×
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="image-upload">
              <div className="image-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={
                    imagePreview.includes("data:image/svg+xml")
                      ? "p-4 text-gray-400"
                      : ""
                  }
                  onClick={() => document.getElementById("imageUpload").click()}
                />
                <div
                  className="image-overlay"
                  onClick={() => document.getElementById("imageUpload").click()}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                {showRemoveImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="remove-image"
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                type="file"
                id="imageUpload"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <div className="upload-buttons">
                <button
                  type="button"
                  onClick={() => document.getElementById("imageUpload").click()}
                  className="btn-upload"
                >
                  📷 Choose Photo
                </button>
                {showRemoveImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="btn-remove"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
              <p className="upload-info">
                Supported: JPG, PNG, GIF, WebP (Max 5MB)
              </p>
              {uploadProgress > 0 && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">Uploading...</p>
                </div>
              )}
              {error && <div className="error-text">{error}</div>}
              {success && <div className="success-text">{success}</div>}
            </div>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter position"
                required
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="btn-group">
              <Link to={`/employee/${id}`} className="btn btn-cancel">
                Cancel
              </Link>
              <button type="submit" className="btn btn-save">
                Save Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEmployee;
