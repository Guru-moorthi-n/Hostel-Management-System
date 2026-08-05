import Sidebar from "./dash-components/Sidebar";
import Header from "./dash-components/Header";
import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../config/api";
import Footer from "../Footer";

function AdminLayout() {
  const navigate = useNavigate();
  const timer = useRef(null);

  useEffect(() => {
    async function setupAutoLogout() {
      const response = await fetch(`${API}/api/hostel-settings`);

      const data = await response.json();

      if (!data.success) return;
      if (!data.settings.auto_logout) return;

      let timeout = 0;

      switch (data.settings.session_timeout) {
        case "15 Minutes":
          timeout = 15 * 60 * 1000;
          break;

        case "30 Minutes":
          timeout = 30 * 60 * 1000;
          break;

        case "60 Minutes":
          timeout = 60 * 60 * 1000;
          break;

        case "Never":
          return;

        default:
          timeout = 30 * 60 * 1000;
      }

      function logout() {
        alert("Session expired due to inactivity.");
        localStorage.clear();
        document.documentElement.setAttribute("data-theme", "light");
        navigate("/");
      }

      function resetTimer() {
        clearTimeout(timer.current);
        timer.current = setTimeout(logout, timeout);
      }

      resetTimer();

      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);

      return () => {
        clearTimeout(timer.current);

        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
        window.removeEventListener("click", resetTimer);
        window.removeEventListener("scroll", resetTimer);
      };
    }

    const cleanup = setupAutoLogout();

    return () => {
      if (cleanup instanceof Function) {
        cleanup();
      }
    };
  }, [navigate]);

  return (
    <>
      <div className="dashboard-layout desktop-dashboard">
        <Sidebar />

        <div className="dashboard-main">
          <Header />

          <div className="dashboard-content">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>

      <div className="dashboard-mobile-block">
        <div className="dashboard-mobile-message">
          <i className="fas fa-laptop"></i>
          <h2>Desktop Only</h2>

          <p>Please open in Laptop or PC to view the dashboard.</p>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
