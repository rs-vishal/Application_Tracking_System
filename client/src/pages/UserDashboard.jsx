import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BsCheckCircleFill, BsClockFill, BsXCircleFill } from "react-icons/bs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/applications");
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (!user) return null;

  // Filter only current user's applications
  const currentUserApplications = applications.filter(
    (app) => app.userId?.username === user.username
  );

  const totalApplied = currentUserApplications.length;
  const hiredCount = currentUserApplications.filter(
    (app) => app.status === "hired"
  ).length;
  const rejectedCount = currentUserApplications.filter(
    (app) => app.status === "rejected"
  ).length;
  const pendingCount = totalApplied - hiredCount - rejectedCount;

  const chartData = [
    { name: "Hired", value: hiredCount },
    { name: "Rejected", value: rejectedCount },
    { name: "Pending", value: pendingCount },
  ];

  const COLORS = ["#10B981", "#EF4444", "#3B82F6"];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-8">Job Application Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Jobs Applied */}
        <div className="bg-gray-800 p-5 rounded-lg shadow hover:bg-gray-750 transition duration-200 flex items-center space-x-4">
          <BsClockFill className="text-yellow-500 text-3xl" />
          <div>
            <h2 className="text-sm uppercase text-gray-400">Total Applied</h2>
            <p className="text-2xl font-semibold">{totalApplied}</p>
          </div>
        </div>

        {/* Hired / Accepted */}
        <div className="bg-gray-800 p-5 rounded-lg shadow hover:bg-gray-750 transition duration-200 flex items-center space-x-4">
          <BsCheckCircleFill className="text-green-500 text-3xl" />
          <div>
            <h2 className="text-sm uppercase text-gray-400">Hired / Accepted</h2>
            <p className="text-2xl font-semibold">{hiredCount}</p>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-gray-800 p-5 rounded-lg shadow hover:bg-gray-750 transition duration-200 flex items-center space-x-4">
          <BsXCircleFill className="text-red-500 text-3xl" />
          <div>
            <h2 className="text-sm uppercase text-gray-400">Rejected</h2>
            <p className="text-2xl font-semibold">{rejectedCount}</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-gray-800 p-5 rounded-lg shadow hover:bg-gray-750 transition duration-200 flex items-center space-x-4">
          <BsClockFill className="text-blue-500 text-3xl" />
          <div>
            <h2 className="text-sm uppercase text-gray-400">Pending</h2>
            <p className="text-2xl font-semibold">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Application Overview</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Pie Chart */}
          <div className="w-full md:w-1/2 h-64 mb-6 md:mb-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Text */}
          <div className="w-full md:w-1/2 md:pl-8 space-y-4">
            <p className="text-lg font-medium">Summary</p>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Total Applications:</span>{" "}
                {totalApplied}
              </p>
              <p>
                <span className="font-medium">Accepted:</span> {hiredCount}{" "}
                ({totalApplied > 0
                  ? ((hiredCount / totalApplied) * 100).toFixed(1)
                  : 0}
                %)
              </p>
              <p>
                <span className="font-medium">Rejected:</span> {rejectedCount}{" "}
                ({totalApplied > 0
                  ? ((rejectedCount / totalApplied) * 100).toFixed(1)
                  : 0}
                %)
              </p>
              <p>
                <span className="font-medium">Pending:</span> {pendingCount}{" "}
                ({totalApplied > 0
                  ? ((pendingCount / totalApplied) * 100).toFixed(1)
                  : 0}
                %)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;