import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you're importing useAuth here

// Icons
import { FaUserTie } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { TbListDetails } from "react-icons/tb";
import { RiFileList3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa";
import { PiSuitcaseSimpleBold } from "react-icons/pi";
import { PiSlideshowFill as LuLayoutDashboard } from "react-icons/pi";

import defaultProfileImage from "../assets/defaultProfile.png";

const Divider = () => <div className="w-full h-[1px] bg-gray-400 my-2" />;

function NavItem({ to, icon, children, onClick }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-white hover:bg-blue-800 px-3 py-2 rounded text-sm"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavItem({ to, icon, children, setIsOpen, onClick }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-white hover:bg-blue-800 px-3 py-2 rounded text-sm"
      onClick={() => {
        setIsOpen(false);
        if (onClick) onClick();
      }}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function Nav() {
  const { user, logout } = useAuth(); 
  const userRole = user ? user.role : null;
  const username = user ? user.username : "Guest";

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderMenuItems = () => {
    switch (userRole) {
      case "admin":
        return (
          <>
            <NavItem to="/dashboard" icon={<LuLayoutDashboard />}>Dashboard</NavItem>
            <Divider />
            <NavItem to="/jobs" icon={<PiSuitcaseSimpleBold />}>Jobs</NavItem>
            <Divider />
            <NavItem to="/admin/recruiters" icon={<FaUserTie />}>Recruiters</NavItem>
            <Divider />
            <NavItem to="/admin/applications" icon={<TbListDetails />}>Applications</NavItem>
            <Divider />
            <NavItem to="/users" icon={<BsPeopleFill />}>Users</NavItem>
          </>
        );
      case "recruiter":
        return (
          <>
            <NavItem to="/dashboard" icon={<LuLayoutDashboard />}>Dashboard</NavItem>
            <Divider />
            <NavItem to="/jobs" icon={<PiSuitcaseSimpleBold />}>Jobs</NavItem>
            <Divider />
            <NavItem to="/applications" icon={<TbListDetails />}>Applications</NavItem>
            <Divider />
            <NavItem to="/create-job" icon={<RiFileList3Line />}>Create Job</NavItem>
          </>
        );
      case "user":
        return (
          <>
            <NavItem to="/dashboard" icon={<LuLayoutDashboard />}>Dashboard</NavItem>
            <Divider />
            <NavItem to="/applied-jobs" icon={<PiSuitcaseSimpleBold />}>Applied Jobs</NavItem>
            <Divider />
            <NavItem to="/jobs" icon={<PiSuitcaseSimpleBold />}>All Jobs</NavItem>
            <Divider />
            <NavItem to="/resume" icon={<FaRegFilePdf />}>My Resume</NavItem>

          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col absolute top-0 left-0 w-[230px] h-full rounded-[10px] z-50" style={{ backgroundColor: "#191E2CFF" }}>
        <div className="h-[44px] flex items-center justify-center">
          <h1 className="text-white m-0">ATS</h1>
        </div>
        <Divider />
        <div className="flex flex-col flex-1 justify-between p-4">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={defaultProfileImage}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white text-sm font-semibold">{username || "User"}</p>
                <p className="text-gray-400 text-xs">{userRole || "Role"}</p>
              </div>
            </div>
            <Divider />
            <nav className="w-full space-y-2 mt-2">
              {user ? renderMenuItems() : (
                <NavItem to="/login" icon={<MdLogout />}>Login</NavItem>
              )}
            </nav>
          </div>
          <nav className="w-full space-y-2 pt-4">
            <Divider />
            {user && (
              <>
                <NavItem to="/settings" icon={<IoSettingsOutline />}>Settings</NavItem>
                <Divider />
                <NavItem to="/login" icon={<MdLogout />} onClick={handleLogout}>Logout</NavItem>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />
    </>
  );
}

function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Changed from auth to directly get user
  const userRole = user ? user.role : null;
  const username = user ? user.username : "Guest";
  
  const handleLogout = () => {
    logout(); // Use the logout function from context
    setIsOpen(false);
  };

  const renderMobileItems = () => {
    switch (userRole) {
      case "admin":
        return (
          <>
            <MobileNavItem to="/dashboard" icon={<LuLayoutDashboard />} setIsOpen={setIsOpen}>Dashboard</MobileNavItem>
            <Divider />
            <MobileNavItem to="/jobs" icon={<PiSuitcaseSimpleBold />} setIsOpen={setIsOpen}>Jobs</MobileNavItem>
            <Divider />
            <MobileNavItem to="/recruiters" icon={<FaUserTie />} setIsOpen={setIsOpen}>Recruiters</MobileNavItem>
            <Divider />
            <MobileNavItem to="/applications" icon={<TbListDetails />} setIsOpen={setIsOpen}>Applications</MobileNavItem>
            <Divider />
            <MobileNavItem to="/users" icon={<BsPeopleFill />} setIsOpen={setIsOpen}>Users</MobileNavItem>
          </>
        );
      case "recruiter":
        return (
          <>
            <MobileNavItem to="/dashboard" icon={<LuLayoutDashboard />} setIsOpen={setIsOpen}>Dashboard</MobileNavItem>
            <Divider />
            <MobileNavItem to="/jobs" icon={<PiSuitcaseSimpleBold />} setIsOpen={setIsOpen}>Jobs</MobileNavItem>
            <Divider />
            <MobileNavItem to="/applications" icon={<TbListDetails />} setIsOpen={setIsOpen}>Applications</MobileNavItem>
            <Divider />
            <MobileNavItem to="/create-job" icon={<RiFileList3Line />} setIsOpen={setIsOpen}>Create Job</MobileNavItem>
          </>
        );
      case "user":
        return (
          <>
            <MobileNavItem to="/dashboard" icon={<LuLayoutDashboard />} setIsOpen={setIsOpen}>Dashboard</MobileNavItem>
            <Divider />
            <MobileNavItem to="/applied-jobs" icon={<PiSuitcaseSimpleBold />} setIsOpen={setIsOpen}>Applied Jobs</MobileNavItem>
            <Divider />
            <MobileNavItem to="/jobs" icon={<PiSuitcaseSimpleBold />} setIsOpen={setIsOpen}>All Jobs</MobileNavItem>
          </>
        );
      default:
        return (
          <MobileNavItem to="/login" icon={<MdLogout />} setIsOpen={setIsOpen}>
            Login
          </MobileNavItem>
        );
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="md:hidden fixed top-4 left-4 z-40 p-2 bg-blue-600 text-white rounded">
        ☰
      </button>

      <div className={`fixed top-0 left-0 w-[230px] h-full bg-[#191E2CFF] transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white text-xl">&times;</button>
        <div className="h-[44px] flex items-center justify-center">
          <h1 className="text-white m-0">ATS</h1>
        </div>
        <Divider />
        <div className="flex flex-col justify-between p-4 h-full">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={defaultProfileImage} alt="User" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-white text-sm font-semibold">{username || "User"}</p>
                <p className="text-gray-400 text-xs">{userRole || "Role"}</p>
              </div>
            </div>
            <Divider />
            <nav className="w-full space-y-2 mt-2">
              {user ? renderMobileItems() : <MobileNavItem to="/login" icon={<MdLogout />} setIsOpen={setIsOpen}>Login</MobileNavItem>}
            </nav>
          </div>
          <nav className="w-full space-y-2 pt-4">
            <Divider />
            {user && (
              <>
                <MobileNavItem to="/settings" icon={<IoSettingsOutline />} setIsOpen={setIsOpen}>Settings</MobileNavItem>
                <Divider />
                <MobileNavItem to="/login" icon={<MdLogout />} setIsOpen={setIsOpen} onClick={handleLogout}>Logout</MobileNavItem>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Nav;
