import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const AdminRecruiters = () => {
  // State
  const [recruiters, setRecruiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recruiters on mount
  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/admin/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();

        // Filter only recruiters
        const recruiterList = data.filter(user => user.role === 'recruiter');
        setRecruiters(recruiterList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  // Filter recruiters based on search term
  const filteredRecruiters = recruiters.filter((recruiter) =>
    recruiter.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Search Bar */}
      <div className="mb-6 w-full sm:w-80 relative mx-auto sm:mx-0">
        <input
          type="text"
          placeholder="Search by Username or Email..."
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

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-400">Loading recruiters...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : filteredRecruiters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRecruiters.map((recruiter) => (
            <div
              key={recruiter._id}
              className="bg-gray-800 p-5 rounded-lg shadow hover:bg-gray-700 transition duration-200"
            >
              <h3 className="font-semibold text-lg mb-2">{recruiter.username}</h3>
              <p className="text-sm text-gray-300 mb-1">Email: {recruiter.email}</p>
              <p className="text-xs text-gray-400 mt-2">
                Role: <span className="capitalize">{recruiter.role}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No matching recruiters found.</p>
      )}
    </div>
  );
};

export default AdminRecruiters;