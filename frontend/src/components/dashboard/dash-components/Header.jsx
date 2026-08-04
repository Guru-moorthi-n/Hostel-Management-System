import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../NotificationModal";
import API from "../../../config/api.js";

function Header() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const role = localStorage.getItem("role");

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch(
          `${API}/api/current-user/${username}`,
        );

        const data = await response.json();
        if (data.success) {
          setCurrentUserId(data.id);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    loadNotifications();
    const interval = setInterval(loadNotifications, 20000);

    return () => clearInterval(interval);
  }, [currentUserId]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  function handleProfile() {
    const role = localStorage.getItem("role");

    if (!currentUserId) return;

    if (role === "admin") {
      navigate(`/admin-dashboard/profile/${currentUserId}`);
    } else if (role === "warden") {
      navigate(`/warden-dashboard/profile/${currentUserId}`);
    } else {
      navigate(`/student/profile/${currentUserId}`);
    }

    setShowProfileMenu(false);
  }

  async function loadNotifications() {
    if (!currentUserId) return;

    try {
      const response = await fetch(
        `${API}/api/notifications/${currentUserId}`,
      );

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function openNotifications() {
    setShowNotifications(true);

    await fetch(
      `${API}/api/notifications/read-all/${currentUserId}`,
      {
        method: "PUT",
      },
    );

    loadNotifications();
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        {role === "student" ? (
          <div className="student-header-logo">
            <h2>HMS</h2>
          </div>
        ) : (
          // <div className="search-box">
          //   <i className="search-icon fas fa-search"></i>

          //   <input type="text" placeholder="Search here..." />
          // </div>
          <h2 className="HeaderTitle">Hostel Mangement System</h2>
        )}
      </div>

      <div className="header-right">
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? (
            <i className="fas fa-toggle-on"></i>
          ) : (
            <i className="fas fa-toggle-off"></i>
          )}
        </button>

        <button className="notification-btn" onClick={openNotifications}>
          <i className="fas fa-bell"></i>

          {notifications.some((n) => !n.is_read) && (
            <span className="notification-badge"></span>
          )}
        </button>

        <div
          className="profile-box"
          ref={menuRef}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="profile-avatar">G</div>

          <div className="profile-info">
            <h4>{localStorage.getItem("full_name")}</h4>

            <p>{localStorage.getItem("role")}</p>
          </div>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <button onClick={handleProfile}>My Profile</button>

              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {showNotifications && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
}

export default Header;