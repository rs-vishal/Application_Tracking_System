import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

const Jobs = () => {
  const userId = localStorage.getItem("userId");
  // State
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/job');
        setJobs(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle apply job
  const handleApplyJob = async (jobId) => {
    if (!userId) {
      setSnackbarMessage("You must be logged in to apply.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (appliedJobs.has(jobId)) {
      setSnackbarMessage("You've already applied for this job.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:4000/api/apply/${jobId}`, {
        userId,
      });

      // Add to applied jobs
      const newAppliedJobs = new Set(appliedJobs);
      newAppliedJobs.add(jobId);
      setAppliedJobs(newAppliedJobs);

      setSnackbarMessage(res.data.msg || "Successfully applied!");
      setSnackbarSeverity("success");
    } catch (err) {
      console.error("Apply error:", err);
      setSnackbarMessage("Failed to apply. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Search Bar */}
      <div className="mb-6 w-full sm:w-80 relative mx-auto sm:mx-0">
        <input
          type="text"
          placeholder="Search by Title, Company or Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full h-10 pl-3 pr-10 py-2
            font-inter text-sm text-gray-200
            bg-gray-800 border border-gray-600 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder:text-gray-400
          "
        />
        <FiSearch
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <p className="text-gray-400">Loading jobs...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-800 p-5 rounded-lg shadow hover:bg-gray-700 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2 truncate">{job.title}</h3>
                <p className="text-sm text-gray-300 mb-1">Company: {job.company}</p>
                <p className="text-sm text-gray-300 mb-1">
                  Salary: {job.salary ? `$${job.salary}` : 'Not specified'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Status: <span className="capitalize">{job.status || "N/A"}</span>
                </p>
                <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                  {job.description}
                </p>
              </div>
              <button
                onClick={() => handleApplyJob(job._id)}
                disabled={appliedJobs.has(job._id)}
                className={`
                  mt-4 px-4 py-2 rounded-md font-medium
                  ${
                    appliedJobs.has(job._id)
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500"
                  }
                `}
              >
                {appliedJobs.has(job._id) ? "Applied" : "Apply"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No matching jobs found.</p>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            backgroundColor:
              snackbarSeverity === 'success'
                ? '#4caf50'
                : snackbarSeverity === 'error'
                ? '#f44336'
                : '#ff9800',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Jobs;