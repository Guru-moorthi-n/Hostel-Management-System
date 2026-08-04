import Sidebar from "./dash-components/Sidebar";
import Header from "./dash-components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";

function WardenLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        <div className="dashboard-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default WardenLayout;