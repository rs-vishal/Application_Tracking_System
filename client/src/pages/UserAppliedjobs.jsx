import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LuSearch } from "react-icons/lu";

const UserAppliedJobs = () => {
  const { user } = useAuth(); // Get current user from AuthContext
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modal
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications for the current user
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/applications");
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err.message);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications by logged-in user and search term
  const filteredApplications = applications.filter((app) => {
    const isCurrentUser = app.userId?.username === user?.username;
    const matchesSearch =
      app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.status.toLowerCase().includes(searchTerm.toLowerCase());

    return isCurrentUser && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Loading your applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Jobs You've Applied For</h1>

      {/* Search Bar */}
      <div className="w-full sm:w-auto relative mb-6">
        <input
          type="text"
          placeholder="Search by Job Title, Company or Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full sm:w-[400px] h-[30px]
            pl-3 pr-8 py-1
            font-inter text-[12px] leading-[17px] text-gray-200
            bg-gray-800 border border-gray-600 rounded-[4px]
            focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder:text-gray-400
          "
        />
        {/* <LuSearch
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        /> */}
      </div>

      {/* Results Section */}
      {filteredApplications.length === 0 ? (
        <p className="text-gray-400">
          You haven't applied for any matching jobs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              onClick={() => setSelectedApplication(app)}
              className="bg-gray-800 cursor-pointer p-5 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="font-semibold text-lg mb-2">{app.jobId.title}</h3>
              <p className="text-sm text-gray-300 mb-1">Company: {app.jobId.company}</p>
              <p className="text-sm text-gray-300 mb-1">
                Salary:{" "}
                {app.jobId.salary ? `$${app.jobId.salary}` : "Not specified"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Status: <span className="capitalize">{app.status}</span>
              </p>
              <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                {app.jobId.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Applied on: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Job Details */}
      <Dialog
        open={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "#1f2937", // Dark background
            color: "white",
          },
        }}
      >
        <DialogTitle className="flex justify-between items-center bg-gray-800 rounded-t-lg">
          <span>Job Details</span>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setSelectedApplication(null)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="bg-gray-900 p-4">
          {selectedApplication && (
            <>
              <Typography variant="h6" gutterBottom>
                Job Title: {selectedApplication.jobId.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Company: {selectedApplication.jobId.company}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Salary:{" "}
                {selectedApplication.jobId.salary
                  ? `$${selectedApplication.jobId.salary}`
                  : "Not specified"}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Status: <strong>{selectedApplication.status}</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                Description: {selectedApplication.jobId.description || "No description provided."}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Applied On: {new Date(selectedApplication.appliedAt).toLocaleString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-800 p-3">
          <Button onClick={() => setSelectedApplication(null)} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserAppliedJobs;