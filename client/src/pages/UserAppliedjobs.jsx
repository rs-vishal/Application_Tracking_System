import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { LuSearch } from "react-icons/lu";

const UserAppliedJobs = () => {
  const { user } = useAuth(); // Get current user from AuthContext
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              className="bg-gray-800 p-5 rounded-lg shadow hover:bg-gray-700 transition duration-200"
            >
              <h3 className="font-semibold text-lg mb-2">{app.jobId.title}</h3>
              <p className="text-sm text-gray-300 mb-1">
                Company: {app.jobId.company}
              </p>
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
    </div>
  );
};

export default UserAppliedJobs;
