import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../ToastContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const { showToast } = useToast();

  const dashboardRoute =
    role === "admin"
      ? "/admin-dashboard"
      : role === "warden"
        ? "/warden-dashboard"
        : "/student-dashboard";

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("full_name");
    localStorage.removeItem("theme");
    localStorage.clear();

    document.documentElement.setAttribute("data-theme", "light");
    showToast("success", "Logged Out", "");
    navigate("/");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-text">
            <h2>HMS</h2>
            {/* <p>Hostel Management System</p> */}
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">
            <button
              className={
                isActive(dashboardRoute) ? "nav-item active" : "nav-item"
              }
              onClick={() => navigate(dashboardRoute)}
            >
              <i className="ni-icon fa fa-home" aria-hidden="true"></i>{" "}
              Dashboard
            </button>

            <p className="nav-section-title">MANAGEMENT</p>

            {(role === "admin" || role === "warden") && (
              <button
                className={
                  isActive(`${dashboardRoute}/users`)
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => navigate(`${dashboardRoute}/users`)}
              >
                <i className="ni-icon fas fa-user-friends"></i> Users
              </button>
            )}

            {(role === "admin" || role === "warden") && (
              <button
                className={
                  isActive(`${dashboardRoute}/rooms`)
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => navigate(`${dashboardRoute}/rooms`)}
              >
                <i className="ni-icon fas fa-bed"></i> Rooms
              </button>
            )}

            {role === "admin" && (
              <button
                className={
                  isActive("/admin-dashboard/fees")
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => navigate("/admin-dashboard/fees")}
              >
                <i className="ni-icon fas fa-money-check"></i>
                Fee Management
              </button>
            )}
          </div>

          <div className="nav-section">
            <p className="nav-section-title">OPERATIONS</p>

            <button
              className={
                isActive(`${dashboardRoute}/complaints`)
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => navigate(`${dashboardRoute}/complaints`)}
            >
              <i className="ni-icon fa fa-commenting"></i>
              Complaints
            </button>
            <button
              className={
                isActive(`${dashboardRoute}/leaves`)
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => navigate(`${dashboardRoute}/leaves`)}
            >
              <i className="ni-icon fas fa-calendar-check"></i>
              Leave Requests
            </button>
            <button
              className={
                isActive(`${dashboardRoute}/notices`)
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => navigate(`${dashboardRoute}/notices`)}
            >
              <i className="ni-icon fas fa-bullhorn"></i> Notices
            </button>
          </div>

          {role === "admin" && (
            <div className="nav-section">
              <p className="nav-section-title">SYSTEM</p>

              {role === "admin" && (
                <button
                  className={
                    isActive(`${dashboardRoute}/settings`)
                      ? "nav-item active"
                      : "nav-item"
                  }
                  onClick={() => navigate(`${dashboardRoute}/settings`)}
                >
                  <i className="ni-icon fa fa-cog"></i>
                  Settings
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          Logout <i className="logout-icon ni-icon fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;