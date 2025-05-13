import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { BsCheckCircleFill, BsClockFill, BsXCircleFill } from 'react-icons/bs';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AdminApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // State
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null); // Selected application for modal

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/admin/applications');
        if (!res.ok) throw new Error('Failed to fetch applications');
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) =>
    app.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper: Get status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <BsClockFill className="inline text-yellow-500 mr-1" />;
      case 'hired':
        return <BsCheckCircleFill className="inline text-green-500 mr-1" />;
      case 'rejected':
        return <BsXCircleFill className="inline text-red-500 mr-1" />;
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="text-white p-4 text-center">Loading applications...</div>
    );
  if (error)
    return (
      <div className="text-red-500 p-4 text-center">Error: {error}</div>
    );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Search Bar */}
      <div className="mb-6 w-full sm:w-80 relative mx-auto sm:mx-0">
        <input
          type="text"
          placeholder="Search by Username, Job Title, or Status..."
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

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <p className="text-gray-400 text-center">No matching applications found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              onClick={() => setSelectedApp(app)}
              className="bg-gray-800 cursor-pointer p-5 rounded-lg shadow hover:bg-gray-700 transition duration-200"
            >
              <h3 className="font-semibold text-lg mb-2 truncate">{app.jobId.title}</h3>
              <p className="text-sm text-gray-300 mb-2">Applicant: <span className="font-medium">{app.userId.username}</span></p>
              
              <p className="flex items-center text-sm font-medium mb-3">
                {getStatusIcon(app.status)}
                <span className="capitalize">{app.status}</span>
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Applied: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Application Details */}
      <Dialog
        open={Boolean(selectedApp)}
        onClose={handleSelectedAppClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#1f2937', // dark background
            color: 'white',
          },
        }}
      >
        <DialogTitle className="flex justify-between items-center bg-gray-800">
          <span>Application Details</span>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleSelectedAppClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="bg-gray-900">
          {selectedApp && (
            <>
              <Typography variant="h6" gutterBottom>
                Job: {selectedApp.jobId.title}
              </Typography>
              <Typography variant="body2"  gutterBottom>
                Company: {selectedApp.jobId.company || "N/A"}
              </Typography>
              <Typography variant="body2"  gutterBottom>
                Salary: {selectedApp.jobId.salary ? `$${selectedApp.jobId.salary}` : "Not specified"}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Status: <strong>{selectedApp.jobId.status || "N/A"}</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                Description: {selectedApp.jobId.description || "No job description provided."}
              </Typography>

              <hr className="my-4 border-gray-700" />

              <Typography variant="h6" gutterBottom>
                Applicant: {selectedApp.userId.username}
              </Typography>
              <Typography variant="body2"  gutterBottom>
                Email: {selectedApp.userId.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Role: {selectedApp.userId.role}
              </Typography>

              <hr className="my-4 border-gray-700" />

              <Typography variant="body2" gutterBottom>
                Application Status: <strong>{selectedApp.status}</strong>
              </Typography>
              <Typography variant="body2" >
                Applied At: {new Date(selectedApp.appliedAt).toLocaleString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-800">
          <Button onClick={handleSelectedAppClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  // Handle closing selected application
  function handleSelectedAppClose() {
    setSelectedApp(null);
  }
};

export default AdminApplications;