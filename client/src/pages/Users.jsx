import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

// Icons
import { LuSearch } from "react-icons/lu";
import { FaEdit, FaUserPlus, FaTrashAlt } from "react-icons/fa";

const Users = () => {
  const { user } = useAuth();
  const userRole = user?.role || null;

  // Modal visibility & edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Snackbar notifications
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
      password: "",
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
      showSnackbar("User created successfully", "success");
      setIsModalOpen(false);
      setFormData({ username: "", email: "", password: "", role: "recruiter" });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "An error occurred";
      showSnackbar(errorMsg, "error");
    }
  };

  // Handle Update User
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/admin/user/edit/${editingUser._id}`,
        {
          username,
          email,
          role,
        }
      );
      const updatedRes = await axios.get("http://localhost:4000/api/admin/users");
      setUsers(updatedRes.data);
      showSnackbar("User updated successfully", "success");
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setEditingUser(null);
      setFormData({ username: "", email: "", password: "", role: "recruiter" });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "An error occurred";
      showSnackbar(errorMsg, "error");
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      showSnackbar("User deleted successfully", "success");
    } catch (err) {
      showSnackbar("Failed to delete user", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredUsers = users.filter(
    (usr) =>
      usr.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="w-full sm:w-auto relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full sm:w-[320px] h-10 px-3 py-2
              font-inter text-sm text-gray-200
              bg-gray-800 border border-gray-600 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              placeholder:text-gray-400 transition-all duration-200
            "
          />
          <LuSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>

        {/* Create Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            flex items-center gap-2
            px-4 py-2 text-sm font-medium
            bg-blue-600 hover:bg-blue-700 active:bg-blue-800
            text-white rounded-lg shadow-md
            transition-all duration-200
          "
        >
          <FaUserPlus /> Create User
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-700 my-4" />

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-400 text-center py-4">Loading users...</p>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredUsers.map((usr) => (
            <div
              key={usr._id}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Role Badge */}
              <div className="flex justify-center pt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    usr.role === "admin"
                      ? "bg-purple-600 text-white"
                      : usr.role === "recruiter"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {usr.role.charAt(0).toUpperCase() + usr.role.slice(1)}
                </span>
              </div>

              {/* User Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white truncate">{usr.username}</h3>
                <p className="text-sm text-gray-300 mt-1">{usr.email}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end p-4 border-t border-gray-700 bg-gray-850">
                <button
                  onClick={() => handleEditUser(usr)}
                  className="text-blue-400 hover:text-blue-300 transition-colors mr-4"
                  title="Edit User"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteUser(usr._id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Delete User"
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-6">No users found.</p>
      )}

      {/* Modal */}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-700 transition-all duration-300 ease-in-out animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-700">
                <h2 className="text-xl font-bold">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form
                onSubmit={isEditModalOpen ? handleUpdateUser : handleCreateUser}
                className="p-6 space-y-4"
              >
                <TextField
                  label="Username"
                  name="username"
                  value={username}
                  onChange={onChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{ className: "text-white" }}
                  InputLabelProps={{ style: { color: "#9ca3af" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "#4b5563",
                      },
                      "&:hover fieldset": {
                        borderColor: "#6b7280",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{ className: "text-white" }}
                  InputLabelProps={{ style: { color: "#9ca3af" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "#4b5563",
                      },
                      "&:hover fieldset": {
                        borderColor: "#6b7280",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                  }}
                />
                {!isEditModalOpen && (
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onChange}
                    fullWidth
                    variant="outlined"
                    required
                    InputProps={{ className: "text-white" }}
                    InputLabelProps={{ style: { color: "#9ca3af" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": {
                          borderColor: "#4b5563",
                        },
                        "&:hover fieldset": {
                          borderColor: "#6b7280",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                        },
                      },
                    }}
                  />
                )}
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: "#9ca3af" }}>Role</InputLabel>
                  <Select
                    name="role"
                    value={role}
                    onChange={onChange}
                    label="Role"
                    sx={{
                      color: "white",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4b5563",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6b7280",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                    }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="recruiter">Recruiter</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
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
};

export default Users;