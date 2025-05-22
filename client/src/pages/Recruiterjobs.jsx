import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// React Icons
import { FaRegEdit, FaTrashAlt, FaBuilding, FaMapMarkerAlt, FaClock, FaDollarSign, FaRegLightbulb } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Recruiterjobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [editJobId, setEditJobId] = useState(null);
  const [formData, setFormData] = useState({});
  const id = localStorage.getItem('userId');

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/recruiter/job/${id}`);
        console.log("API Response Data:", res.data);
        setJobs(res.data);
      } catch (err) {
        showSnackbar('Failed to load jobs', 'error');
      }
    };
    fetchJobs();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (jobId) => {
    try {
      await axios.put(`http://localhost:4000/api/recruiter/job/${jobId}`, formData);
      const updatedJobs = jobs.map((job) =>
        job._id === jobId ? { ...job, ...formData } : job
      );
      setJobs(updatedJobs);
      setEditJobId(null);
      showSnackbar('Job updated successfully!', 'success');
    } catch (err) {
      showSnackbar('Failed to update job.', 'error');
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`http://localhost:4000/api/recruiter/job/${jobId}`);
        setJobs(jobs.filter((job) => job._id !== jobId));
        showSnackbar('Job deleted successfully!', 'success');
      } catch (err) {
        showSnackbar('Failed to delete job.', 'error');
      }
    }
  };

  const startEditing = (job) => {
    setEditJobId(job._id);
    setFormData({ ...job });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!jobs.length)
    return (
      <p className="text-center text-lg mt-10 flex items-center justify-center gap-2">
        <AiOutlineLoading3Quarters className="animate-spin" /> No jobs found
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900 rounded-xl shadow-xl text-white mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Your Posted Jobs</h2>

      <div className="space-y-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            {editJobId === job._id ? (
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                      <FaRegLightbulb /> Title
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                      <FaBuilding /> Company
                    </label>
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                      <FaMapMarkerAlt /> Location
                    </label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                      <FaClock /> Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                      <FaDollarSign /> Salary
                    </label>
                    <input
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      type="number"
                      className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => handleUpdate(job._id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition duration-200 flex items-center gap-2"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditJobId(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-blue-400">{job.title}</h3>
                <p className="flex items-center gap-2"><FaBuilding /> <strong>Company:</strong> {job.company}</p>
                <p className="flex items-center gap-2"><FaMapMarkerAlt /> <strong>Location:</strong> {job.location || 'Remote'}</p>
                <p className="flex items-center gap-2"><FaClock /> <strong>Type:</strong> {job.type}</p>
                <p className="flex items-center gap-2"><FaDollarSign /> <strong>Salary:</strong> {job.salary ? `$${job.salary}` : 'Not specified'}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <p className="flex items-start gap-2"><FaRegLightbulb /> <strong>Description:</strong> {job.description}</p>

                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => startEditing(job)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition duration-200"
                  >
                    <FaRegEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition duration-200"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{  width: '100%',
      bgcolor: snackbarSeverity === 'success' ? '#10b981' : '#ef4444', 
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1rem',
      boxShadow: 3, }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Recruiterjobs;