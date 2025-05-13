import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { IoIosAddCircleOutline, IoMdClose, IoMdTrash } from "react-icons/io";
import axios from "axios";
import { LuSearch } from "react-icons/lu";
import { Snackbar, Alert } from "@mui/material";
import { FaEdit } from "react-icons/fa";

function Users() {
  const { user } = useAuth();
  const userRole = user?.role || null;

  // Modal visibility & edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "recruiter",
  });

  // Search & User list
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { username, email, password, role } = formData;

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (userRole !== "admin") {
    return (
      <div className="text-center text-red-500 p-6 bg-gray-900 min-h-screen text-white">
        You do not have permission to view this page.
      </div>
    );
  }

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Open edit modal with user data
  const handleEditUser = (usr) => {
    setEditingUser(usr);
    setFormData({
      username: usr.username,
      email: usr.email,
      password: "", // leave empty unless changing password
      role: usr.role,
    });
    setIsModalOpen(true);
    setIsEditModalOpen(true);
  };

  // Handle Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/admin/create_recruiter", {
        username,
        email,
        password,
        role,
      });

      const updatedRes = await axios.get("http://localhost:4000/api/admin/users");
      setUsers(updatedRes.data);

      setSnackbarMessage("User created successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setIsModalOpen(false);
      setFormData({ username: "", email: "", password: "", role: "recruiter" });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "An error occurred";
      console.error(errorMsg);
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle Update User
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:4000/api/admin/user/edit/${editingUser._id}`,
        {
          username,
          email,
          role,
        }
      );

      const updatedRes = await axios.get("http://localhost:4000/api/admin/users");
      setUsers(updatedRes.data);

      setSnackbarMessage("User updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setEditingUser(null);
      setFormData({ username: "", email: "", password: "", role: "recruiter" });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "An error occurred";
      console.error(errorMsg);
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Delete User without confirm()
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));

      setSnackbarMessage("User deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting user:", err.message);
      setSnackbarMessage("Failed to delete user");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (usr) =>
      usr.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      {/* Search + Create Button Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-auto relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="
              w-full sm:w-[400px] h-[30px]
              pl-3 pr-8 py-1
              font-inter text-[12px] leading-[17px] text-gray-200
              bg-gray-800 border border-gray-600 rounded-[4px]
              focus:outline-none focus:ring-2 focus:ring-blue-500
              placeholder:text-gray-400
            "
          />
          <LuSearch
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`
            flex items-center justify-center gap-1
            font-inter text-[12px] leading-[17px] font-normal text-white
            bg-[#191E2C] opacity-100 rounded-[2px] border border-white
            hover:bg-[#1f2937] hover:text-white
            active:bg-[#191E2C] active:text-white
            disabled:opacity-40
            px-3 py-1.5 sm:px-4 sm:py-2
          `}
        >
          <IoIosAddCircleOutline className="h-[16px]" /> Create User
        </button>
      </div>
      <div className="w-full h-[1px] bg-gray-700 my-2" />

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-400">Loading users...</p>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4 mt-6">
          {filteredUsers.map((usr) => (
            <div
              key={usr._id}
              className="relative bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md"
            >
              {/* Role badge centered horizontally */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -top-0.5">
                <span className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {usr.role}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                {/* User Info */}
                <div className="flex flex-col items-start mx-4 text-left">
                  <h3 className="text-lg font-semibold">{usr.username}</h3>
                  <p className="text-sm text-gray-300">{usr.email}</p>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleEditUser(usr)}
                    className="text-blue-400 hover:text-blue-300"
                    title="Edit User"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(usr._id)}
                    className="text-red-400 hover:text-red-300"
                    title="Delete User"
                  >
                    <IoMdTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No users found.</p>
      )}

      {/* Dark Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
            onClick={() => {
              setIsModalOpen(false);
              setIsEditModalOpen(false);
              setEditingUser(null);
            }}
          ></div>
          {/* Responsive Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-md mx-auto border border-gray-700 transition-all duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Close Button */}
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold">
                  {isEditModalOpen ? "Edit User" : "Create New User"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <IoMdClose size={24} />
                </button>
              </div>

              {/* Body */}
              <form
                onSubmit={isEditModalOpen ? handleUpdateUser : handleCreateUser}
                className="p-6 space-y-4"
              >
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Password - only required when creating */}
                {!isEditModalOpen && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      required={!isEditModalOpen}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Role
                  </label>
                  <select
                    name="role"
                    value={role}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user" className="bg-gray-800">
                      User
                    </option>
                    <option value="recruiter" className="bg-gray-800">
                      Recruiter
                    </option>
                    <option value="admin" className="bg-gray-800">
                      Admin
                    </option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors duration-200"
                  >
                    {isEditModalOpen ? "Update User" : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbarSeverity === "success" ? "#4caf50" : "#f44336",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Users;