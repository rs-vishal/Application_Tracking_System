import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Settings() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    skills: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const userId = localStorage.getItem("userId"); // or get from auth context

  const handleOpenSnackbar = () => setSnackbarOpen(true);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/user/${userId}`);
        const user = res.data;

        let skillsArray = [];
        if (Array.isArray(user.skills)) {
          skillsArray = user.skills;
        } else if (typeof user.skills === "string") {
          skillsArray = user.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0);
        }

        setFormData({
          username: user.username || "",
          email: user.email || "",
          skills: skillsArray,
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err.message);
        setMessage("Could not load profile data.");
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || formData.skills.includes(trimmed)) return;
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("skills", JSON.stringify(formData.skills));
    if (resume) data.append("resume", resume);

    try {
      const res = await axios.put(
        `http://localhost:4000/api/edit_profile/${userId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSnackbarMessage(res.data.msg || "Profile updated successfully!");
      setSeverity("success");
      handleOpenSnackbar();
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Error updating profile.";
      setMessage(errorMsg);
      setSnackbarMessage(errorMsg);
      setSeverity("error");
      handleOpenSnackbar();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Username */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Skills Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="skills">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="skills"
                name="skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill"
                className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Add
              </button>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-red-400 hover:text-red-300 font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="resume">
              Upload Resume (PDF, DOC, DOCX)
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md file:bg-gray-600 file:text-white file:border-0 file:py-1 file:px-3 focus:outline-none"
            />
          </div>

          {/* Message */}
          {message && (
            <p className="mb-4 text-center text-sm text-yellow-400">
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:bg-blue-800"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Settings;
