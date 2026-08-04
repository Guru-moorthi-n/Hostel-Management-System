import "./dashboard.css";

function StudentLeaveDetails({ leave, onClose }) {
  if (!leave) return null;

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const totalDays =
    Math.ceil(
      (new Date(leave.to_date) - new Date(leave.from_date)) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  return (
    <div className="modal-overlay">
      <div className="student-modal complaint-view-modal">
        <div className="modal-header">
          <h2>Leave Details</h2>

          <button onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="complaint-view-body">
          <div className="complaint-status-row">
            <span>Status</span>

            <span
              className={`status ${
                leave.status === "Approved"
                  ? "approved"
                  : leave.status === "Rejected"
                    ? "rejected"
                    : "pending"
              }`}
            >
              {leave.status}
            </span>
          </div>

          <div className="complaint-info">
            <label>Leave Type</label>
            <p>{leave.leave_type}</p>
          </div>

          <div className="complaint-grid">
            <div>
              <label>From Date</label>
              <p>{formatDate(leave.from_date)}</p>
            </div>

            <div>
              <label>To Date</label>
              <p>{formatDate(leave.to_date)}</p>
            </div>
          </div>

          <div className="complaint-grid">
            <div>
              <label>Total Days</label>
              <p>
                {totalDays} Day{totalDays > 1 ? "s" : ""}
              </p>
            </div>

            <div>
              <label>Room</label>
              <p>{leave.room_number || "-"}</p>
            </div>
          </div>

          <div className="complaint-info">
            <label>Reason</label>

            <div className="complaint-description">{leave.reason}</div>
          </div>

          <div className="complaint-info">
            <label>Submitted On</label>

            <p>{new Date(leave.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLeaveDetails;