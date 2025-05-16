import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { BsCheckCircleFill, BsClockFill, BsXCircleFill } from 'react-icons/bs';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
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
  const [selectedApp, setSelectedApp] = useState(null);

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
 const getStatusChip = (status) => {
  switch (status) {
    case 'applied':
      return (
        <Chip
          icon={<BsClockFill className="text-yellow-500" />}
          label="Applied"
          size="small"
          sx={{
            backgroundColor: '#fbbf2433', 
            color: '#fcd34d',          
            fontWeight: 600,
            borderRadius: '8px',       
          }}
        />
      );
    case 'hired':
      return (
        <Chip
          icon={<BsCheckCircleFill className="text-green-500" />}
          label="Hired"
          size="small"
          sx={{
            backgroundColor: '#4ade8033', 
            color: '#a7f3d0',           
            fontWeight: 600,
            borderRadius: '8px',
          }}
        />
      );
    case 'rejected':
      return (
        <Chip
          icon={<BsXCircleFill className="text-red-500" />}
          label="Rejected"
          size="small"
          sx={{
            backgroundColor: '#ef444433', 
            color: '#f87171',            
            fontWeight: 600,
            borderRadius: '8px',
          }}
        />
      );
    default:
      return null;
  }
};

  if (loading)
    return (
      <div className="text-white p-4 text-center animate-pulse">Loading applications...</div>
    );
  if (error)
    return (
      <div className="text-red-500 p-4 text-center animate-pulse">Error: {error}</div>
    );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Search Bar */}
      <div className="mb-8 w-full sm:w-96 relative mx-auto sm:mx-0">
        <input
          type="text"
          placeholder="Search by Username, Job Title, or Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full h-12 pl-4 pr-12 py-2
            font-inter text-sm text-gray-200
            bg-gray-800 border border-gray-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder:text-gray-400 transition-all duration-200
          "
        />
        <FiSearch
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
      </div>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-10">
          <Typography variant="body1" className="text-gray-400">
            No matching applications found.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              onClick={() => setSelectedApp(app)}
              className="bg-gray-800 cursor-pointer p-5 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="font-bold text-lg mb-2 truncate">{app.jobId.title}</h3>
              <p className="text-sm text-gray-300 mb-2">
                Applicant: <span className="font-semibold">{app.userId.username}</span>
              </p>
              <div className="mb-3 flex items-center">{getStatusChip(app.status)}</div>
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
        onClose={() => setSelectedApp(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            color: 'white',
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle className="flex justify-between items-center bg-gray-800 rounded-t-lg">
          <span className="text-lg font-semibold">Application Details</span>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setSelectedApp(null)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="bg-gray-900 p-4">
          {selectedApp && (
            <>
              <Typography variant="h6" gutterBottom>
                📌 {selectedApp.jobId.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Company: <strong>{selectedApp.jobId.company || "N/A"}</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Salary: <strong>{selectedApp.jobId.salary ? `$${selectedApp.jobId.salary}` : "Not specified"}</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Status: <strong>{selectedApp.jobId.status || "N/A"}</strong>
              </Typography>
              <Typography variant="body2" paragraph className="mt-2">
                Description: {selectedApp.jobId.description || "No job description provided."}
              </Typography>

              <hr className="my-4 border-gray-700" />

              <Typography variant="h6" gutterBottom>
                👤 Applicant: {selectedApp.userId.username}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Email: {selectedApp.userId.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Role: {selectedApp.userId.role}
              </Typography>

              <hr className="my-4 border-gray-700" />

              <Typography variant="body2" gutterBottom>
                📄 Application Status: <strong>{selectedApp.status}</strong>
              </Typography>
              <Typography variant="body2">
                🕒 Applied At: {new Date(selectedApp.appliedAt).toLocaleString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-800 p-3">
          <Button onClick={() => setSelectedApp(null)} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminApplications;