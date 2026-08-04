import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login.jsx";
import Signup from "./components/signup/signup.jsx";
import Footer from "./components/Footer.jsx";
import AdminLayout from "./components/dashboard/AdminLayout.jsx";
import ProtectedRoute from "./components/dashboard/ProtectedRoute.jsx";
import AdminDashboard from "./components/dashboard/admin-dashboard.jsx";
import StudentDashboard from "./components/dashboard/student-dashboard.jsx";
import Users from "./components/dashboard/admin-dash-components/Users/Users.jsx";
import StudentProfile from "./components/dashboard/admin-dash-components/Profile/StudentProfile.jsx";
import Rooms from "./components/dashboard/admin-dash-components/Rooms/Rooms.jsx";
import Complaints from "./components/dashboard/admin-dash-components/Complaints/Complaints.jsx";
import FeeManagement from "./components/dashboard/admin-dash-components/Fees/FeeManagement.jsx";
import LeaveRequests from "./components/dashboard/admin-dash-components/LeaveRequests/LeaveRequests.jsx";
import NoticeBoard from "./components/dashboard/admin-dash-components/NoticeBoard/NoticeBoard.jsx";
import Settings from "./components/dashboard/admin-dash-components/Settings/Settings.jsx";

import WardenLayout from "./components/dashboard/WardenLayout.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login login_heading="Login" />} />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <Signup
                signup_heading="Create User"
                switch_message="Already have an Account?"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="users" element={<Users />} />
          <Route path="profile/:id" element={<StudentProfile />} />

          <Route path="rooms" element={<Rooms />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="notices" element={<NoticeBoard />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="/warden-dashboard"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <WardenLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="users" element={<Users />} />
          <Route path="profile/:id" element={<StudentProfile />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="notices" element={<NoticeBoard />} />
        </Route>

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/student/profile/:id" element={<StudentProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;