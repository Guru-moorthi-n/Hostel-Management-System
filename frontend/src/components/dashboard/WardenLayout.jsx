import Sidebar from "./dash-components/Sidebar";
import Header from "./dash-components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import "./dashboard.css";

function WardenLayout() {
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

export default WardenLayout;