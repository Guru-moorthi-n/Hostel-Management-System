import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "./dash-components/Sidebar.jsx";
import Header from "./dash-components/Header.jsx";
import "./dashboard.css";
import DashboardCard from "./admin-dash-components/DashboardCard.jsx";
import API from "../../config/api.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function AdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const dashboardRoute =
    role === "admin" ? "/admin-dashboard" : "/warden-dashboard";

  function handleCreateUserClick() {
    navigate("/create-user");
  }

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  const [stats, setStats] = useState({
    students: 0,
    activeStudents: 0,

    rooms: 0,
    availableRooms: 0,

    occupied: 0,
    occupancyPercentage: 0,

    complaints: 0,
    resolvedComplaints: 0,

    leaves: 0,
    approvedLeaves: 0,
  });

  const [overview, setOverview] = useState([]);
  const [notices, setNotices] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    loadDashboardStats();
    loadStudentOverview();
    loadNotices();
    loadLeaves();
    loadComplaints();
  }, []);

  async function loadDashboardStats() {
    try {
      const response = await fetch(`${API}/api/dashboard/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadStudentOverview() {
    try {
      const response = await fetch(
        `${API}/api/dashboard/student-overview`,
      );

      const data = await response.json();

      if (data.success) {
        setOverview(data.overview);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const chartData = {
    labels: overview.map((item) => item.department),

    datasets: [
      {
        label: "Students",
        data: overview.map((item) => Number(item.total)),
        backgroundColor: "#4f46e5",
        borderRadius: 5,
        maxBarThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },
      },
    },
  };

  async function loadNotices() {
    try {
      const response = await fetch(`${API}/api/notices`);
      const data = await response.json();

      if (data.success) {
        setNotices(data.notices.slice(0, 3));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadLeaves() {
    try {
      const response = await fetch(`${API}/api/leaves`);
      const data = await response.json();

      if (data.success) {
        setLeaves(data.leaves);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadComplaints() {
    try {
      const response = await fetch(`${API}/api/complaints`);
      const data = await response.json();

      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <section className="welcome-section">
        <div className="welcome-left">
          <h1>Welcome back, {localStorage.getItem("full_name")} !</h1>

          <p>Here's what's happening in your hostel today.</p>
        </div>

        <div className="welcome-right">
          <button className="create-user-btn" onClick={handleCreateUserClick}>
            <i className="fas fa-plus"></i>
            Create User
          </button>

          <button className="date-btn">
            <i className="far fa-calendar"></i>
            {today}
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <DashboardCard
          title="Total Students"
          value={stats.students}
          info={`${stats.activeStudents} Active`}
          iconClass="fas fa-users"
        />

        <DashboardCard
          title="Total Rooms"
          value={stats.rooms}
          info={`${stats.availableRooms} Available`}
          iconClass="fas fa-bed"
        />

        <DashboardCard
          title="Occupied Rooms"
          value={stats.occupied}
          info={`${stats.occupancyPercentage}% Occupied`}
          iconClass="fas fa-door-closed"
        />

        <DashboardCard
          title="Pending Complaints"
          value={stats.complaints}
          info={`${stats.resolvedComplaints} Resolved`}
          iconClass="fas fa-exclamation-circle"
        />

        <DashboardCard
          title="Pending Leaves"
          value={stats.leaves}
          info={`${stats.approvedLeaves} Approved`}
          iconClass="fas fa-calendar-times"
        />
      </section>

      <section className="middle-grid">
        <div className="overview-box">
          <div className="box-header">
            <h3>Student Overview</h3>
          </div>

          <div
            className="dummy-chart"
            style={{
              border: "none",
            }}
          >
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="notice-box">
          <div className="box-header">
            <h3>Recent Notices</h3>

            <span onClick={() => navigate(`${dashboardRoute}/notices`)}>
              View All
            </span>
          </div>

          <div className="notice-list">
            {notices.map((notice) => (
              <div className="notice-item" key={notice.id}>
                <div className="notice-icon">
                  <i className="fas fa-bullhorn"></i>
                </div>

                <div className="notice-content">
                  <h4>{notice.title}</h4>

                  <p>
                    {notice.type} •{" "}
                    {new Date(notice.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="table-box">
          <div className="table-header">
            <h3>Recent Leave Requests</h3>

            <span onClick={() => navigate(`${dashboardRoute}/leaves`)}>
              View All
            </span>
          </div>

          <div className="dashboard-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.full_name}</td>

                    <td title={leave.reason}>
                      {truncateText(leave.reason, 12)}
                    </td>

                    <td>
                      {new Date(leave.from_date).toLocaleDateString("en-GB")}
                    </td>

                    <td>
                      {new Date(leave.to_date).toLocaleDateString("en-GB")}
                    </td>

                    <td>
                      <span className={`status ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-box">
          <div className="table-header">
            <h3>Recent Complaints</h3>

            <span onClick={() => navigate(`${dashboardRoute}/complaints`)}>
              View All
            </span>
          </div>

          <div className="dashboard-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Issue</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>{complaint.full_name}</td>

                    <td title={complaint.title}>
                      {truncateText(complaint.title, 12)}
                    </td>

                    <td>
                      {new Date(complaint.created_at).toLocaleDateString(
                        "en-GB",
                      )}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          complaint.status === "Resolved"
                            ? "approved"
                            : complaint.status === "In Progress"
                              ? "progress"
                              : complaint.status.toLowerCase()
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;