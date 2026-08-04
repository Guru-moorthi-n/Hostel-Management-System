import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./dash-components/Header";
import "./dashboard.css";
import NoticeDetails from "./admin-dash-components/NoticeBoard/NoticeDetails.jsx";
import StudentNoticeModal from "./admin-dash-components/NoticeBoard/StudentNoticeModal";
import RaiseComplaintModal from "./admin-dash-components/Complaints/RaiseComplaintModal.jsx";
import StudentComplaintDetails from "./StudentComplaintDetails";
import ApplyLeaveModal from "./admin-dash-components/LeaveRequests/ApplyLeaveModal.jsx";
import StudentLeaveDetails from "./StudentLeaveDetails.jsx";
import API from "../../config/api.js";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showNoticeDetails, setShowNoticeDetails] = useState(false);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintDetails, setShowComplaintDetails] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadStudent();
    loadComplaints();
    loadLeaves();
    loadNotices();
  }, []);

  async function loadStudent() {
    try {
      const username = localStorage.getItem("username");

      const usersResponse = await fetch(`${API}/api/users`);
      const usersData = await usersResponse.json();

      if (!usersData.success) return;

      const currentUser = usersData.users.find(
        (user) => user.username === username,
      );

      if (!currentUser) return;

      const response = await fetch(
        `${API}/api/student/${currentUser.id}`,
      );

      const data = await response.json();

      if (data.success) {
        setStudent(data.student);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadComplaints() {
    try {
      const response = await fetch(`${API}/api/complaints`);
      const data = await response.json();

      if (!data.success) return;

      const username = localStorage.getItem("username");

      setComplaints(
        data.complaints
          .filter((item) => item.username === username)
          .slice(0, 2),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function loadLeaves() {
    try {
      const response = await fetch(`${API}/api/leaves`);
      const data = await response.json();

      if (!data.success) return;

      const username = localStorage.getItem("full_name");

      setLeaves(data.leaves.filter((item) => item.full_name === username));
    } catch (error) {
      console.log(error);
    }
  }

  async function loadNotices() {
    try {
      const response = await fetch(`${API}/api/notices`);
      const data = await response.json();

      if (data.success) {
        setNotices(data.notices);
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
    <div className="student-dashboard-layout">
      <div className="student-dashboard-main">
        <div className="student-header-wrapper">
          <Header />
        </div>

        <div className="dashboard-content">
          <section className="welcome-section">
            <div className="welcome-left">
              <h1>Welcome back, {localStorage.getItem("full_name")} !</h1>

              <p>Here's what's happening in your hostel today.</p>
            </div>

            <div className="welcome-right">
              <button className="date-btn">
                <i className="far fa-calendar"></i>
                {today}
              </button>
            </div>
          </section>
          
          <section className="student-top-grid">
            <div className="student-card">
              <div className="box-header">
                <h3>My Room Details</h3>
              </div>

              <div className="room-details">
                <div className="room-row">
                  <span>Room Number</span>
                  <strong>{student?.room_number || "-"}</strong>
                </div>

                <div className="room-row">
                  <span>Block</span>
                  <strong>{student?.block || "-"} Block</strong>
                </div>

                <div className="room-row">
                  <span>Floor</span>
                  <strong>{student?.floor || "-"} Floor</strong>
                </div>

                <div className="room-row">
                  <span>Room Capacity</span>
                  <strong>{student?.capacity || "-"} Beds</strong>
                </div>

                <div className="room-row">
                  <span>Occupancy</span>
                  <strong>
                    {student ? Math.max(student.occupancy - 1, 0) : "-"}
                  </strong>
                </div>
              </div>

              <div className="wifi-box">
                <i className="fas fa-wifi"></i>
                Wi-Fi Available
              </div>
            </div>

            <div className="student-card">
              <div className="box-header">
                <h3>Latest Notices</h3>

                <button
                  className="student-outline-btn"
                  onClick={() => setShowAllNotices(true)}
                >
                  View All
                </button>
              </div>

              <div className="notice-list">
                {notices.length === 0 ? (
                  <div className="student-empty">
                    <i className="far fa-bell-slash"></i>

                    <p>No notices available.</p>
                  </div>
                ) : (
                  notices.map((notice) => (
                    <div
                      className={`notice-item ${notice.is_pinned ? "pinned" : ""}`}
                      key={notice.id}
                      onClick={() => {
                        setSelectedNotice(notice);
                        setShowNoticeDetails(true);
                      }}
                    >
                      <div className="notice-content">
                        <div className="notice-title-row">
                          <h4>{notice.title}</h4>

                          {notice.is_pinned && (
                            <span className="notice-pin">
                              <i className="fas fa-thumbtack"></i>
                            </span>
                          )}
                        </div>

                        <p>{notice.description}</p>

                        <small>
                          {new Date(notice.created_at).toLocaleDateString(
                            "en-GB",
                          )}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="student-card">
              <div className="box-header">
                <h3>My Profile</h3>

                <button
                  className="student-outline-btn"
                  onClick={() => navigate(`/student/profile/${student.id}`)}
                >
                  View Profile
                </button>
              </div>

              <div className="profile-summary">
                <div className="profile-top">
                  <div className="profile-avatar-large">
                    {student?.full_name?.charAt(0)}
                  </div>

                  <div className="profile-name">
                    <h3>{student?.full_name}</h3>

                    <p>{student?.register_number}</p>
                  </div>
                </div>

                <div className="profile-divider"></div>

                <div className="profile-row">
                  <span>Department</span>
                  <strong>{student?.department || "-"}</strong>
                </div>

                <div className="profile-row">
                  <span>Year</span>
                  <strong>{student?.year || "-"}</strong>
                </div>

                <div className="profile-row">
                  <span>Phone</span>
                  <strong>{student?.phone || "-"}</strong>
                </div>

                <div className="profile-row">
                  <span>Email</span>
                  <strong>{student?.email || "-"}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="table-box">
              <div className="table-header">
                <h3>My Complaints</h3>

                <button
                  className="student-outline-btn"
                  onClick={() => setShowComplaintModal(true)}
                >
                  <i className="fas fa-plus"></i> Raise Complaint
                </button>
              </div>

              <div className="student-summary">
                <div>
                  <strong>
                    {complaints.filter((c) => c.status !== "Resolved").length}
                  </strong>

                  <span>Pending</span>
                </div>

                <div>
                  <strong>
                    {complaints.filter((c) => c.status === "Resolved").length}
                  </strong>

                  <span>Resolved</span>
                </div>
              </div>

              <div className="student-list">
                {complaints.length === 0 ? (
                  <div className="student-empty">
                    <i className="far fa-circle-check"></i>

                    <p>No complaints raised.</p>
                  </div>
                ) : (
                  complaints.map((complaint) => (
                    <div
                      className="student-item"
                      key={complaint.id}
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowComplaintDetails(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <h4>{complaint.title}</h4>

                        <p>
                          {new Date(complaint.created_at).toLocaleDateString(
                            "en-GB",
                          )}
                        </p>
                      </div>

                      <span
                        className={`status ${
                          complaint.status === "Resolved"
                            ? "approved"
                            : complaint.status === "In Progress"
                              ? "progress"
                              : "pending"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="table-box">
              <div className="table-header">
                <h3>My Leave Requests</h3>

                <button
                  className="student-outline-btn"
                  onClick={() => setShowLeaveModal(true)}
                >
                  <i className="fas fa-plus"></i> Apply Leave
                </button>
              </div>

              <div className="student-summary">
                <div>
                  <strong>
                    {leaves.filter((l) => l.status === "Pending").length}
                  </strong>

                  <span>Pending</span>
                </div>

                <div>
                  <strong>
                    {leaves.filter((l) => l.status === "Approved").length}
                  </strong>

                  <span>Approved</span>
                </div>
              </div>

              <div className="student-list">
                {leaves.length === 0 ? (
                  <div className="student-empty">
                    <i className="far fa-calendar-xmark"></i>

                    <p>No leave requests.</p>
                  </div>
                ) : (
                  leaves.map((leave) => (
                    <div
                      className="student-item"
                      key={leave.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedLeave(leave);
                        setShowLeaveDetails(true);
                      }}
                    >
                      <div>
                        <h4>{leave.leave_type}</h4>

                        <p>
                          {new Date(leave.from_date).toLocaleDateString(
                            "en-GB",
                          )}
                        </p>
                      </div>

                      <span className={`status ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      {showNoticeDetails && (
        <NoticeDetails
          notice={selectedNotice}
          refresh={() => {}}
          onClose={() => setShowNoticeDetails(false)}
          onEdit={() => {}}
          onDelete={() => {}}
          readOnly={true}
        />
      )}

      {showAllNotices && (
        <StudentNoticeModal
          notices={notices}
          onClose={() => setShowAllNotices(false)}
          onNoticeClick={(notice) => {
            setShowAllNotices(false);
            setSelectedNotice(notice);
            setShowNoticeDetails(true);
          }}
        />
      )}

      {showComplaintModal && (
        <RaiseComplaintModal
          onClose={() => setShowComplaintModal(false)}
          refreshComplaints={loadComplaints}
        />
      )}

      {showComplaintDetails && (
        <StudentComplaintDetails
          complaint={selectedComplaint}
          onClose={() => setShowComplaintDetails(false)}
        />
      )}

      {showLeaveModal && (
        <ApplyLeaveModal
          onClose={() => setShowLeaveModal(false)}
          refreshLeaves={loadLeaves}
        />
      )}

      {showLeaveDetails && (
        <StudentLeaveDetails
          leave={selectedLeave}
          onClose={() => setShowLeaveDetails(false)}
        />
      )}
    </div>
  );
}

export default StudentDashboard;