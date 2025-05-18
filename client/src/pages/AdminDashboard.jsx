import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Summary Card Component
const DashboardCard = ({ title, value, color }) => (
  <div className={`p-5 rounded-lg shadow-md ${color} text-white transform transition duration-300 hover:scale-105`}>
    <h3 className="text-sm uppercase font-semibold tracking-wide">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

// Custom Tooltip for Dark Mode
const DarkModeTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 border border-gray-600 rounded shadow text-white text-xs">
        <p>{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Stats calculation
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    hired: applications.filter((a) => a.status === 'hired').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    today: applications.filter(
      (a) =>
        new Date(a.appliedAt).toDateString() === new Date().toDateString()
    ).length,
  };

  // Pie chart data
  const pieData = [
    { name: 'Applied', value: stats.applied },
    { name: 'Hired', value: stats.hired },
    { name: 'Rejected', value: stats.rejected },
  ];

  const COLORS = ['#fbbf24', '#4ade80', '#ef4444'];

  // Bar chart data
  const jobStats = applications.reduce((acc, app) => {
    const title = app.jobId?.title || 'Untitled Job';
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(jobStats).map(([name, value]) => ({ name, value }));

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Loading dashboard...</span>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg text-center">
        <strong>Error:</strong> {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white space-y-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <DashboardCard title="Total Apps" value={stats.total} color="bg-blue-600" />
        <DashboardCard title="Applied" value={stats.applied} color="bg-yellow-600" />
        <DashboardCard title="Hired" value={stats.hired} color="bg-green-600" />
        <DashboardCard title="Rejected" value={stats.rejected} color="bg-red-600" />
        <DashboardCard title="Today" value={stats.today} color="bg-purple-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution Chart */}
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<DarkModeTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Per Job Chart */}
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Applications Per Job</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#cbd5e1" />
              <Tooltip content={<DarkModeTooltip />} />
              <Legend />
              <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;