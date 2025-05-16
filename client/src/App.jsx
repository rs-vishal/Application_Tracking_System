import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from "./pages/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Register from './pages/Register';
import {useAuth} from './context/AuthContext';
import AdminApplications from './pages/AdminApplications';
import Settings from "./pages/Settings";
import AdminRecruiters from './pages/AdminRecruiters';
import Jobs from './pages/Jobs';
import UserAppliedJobs from './pages/UserAppliedjobs';
import ResumeView from './pages/ResumeView';
import UserDashboard from './pages/UserDashboard';
function App() {
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const role = user?.role;
  console.log(role);
  return (
    <div className="app">
      {token ? (
        <>
          <Nav />
          <main className="content">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path='jobs' element={<Jobs/>}/>
              <Route path='/applied-jobs' element={<UserAppliedJobs/>}/>
              <Route path= '/resume' element={<ResumeView/>}/>
              <Route path = '/user/dashboard' element={<UserDashboard/>}/>
              {role === "admin" && (
                <>
                  {/* <Route path="/admin" element={<h1>Admin</h1>} /> */}
                  <Route path="/admin/applications" element={<AdminApplications/>} />
                  <Route path="/admin/recruiters" element={<AdminRecruiters/>} />
                                <Route path='/admin/users' element={<Users/>}/>

                </>
              )}
            </Routes>
          </main>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
