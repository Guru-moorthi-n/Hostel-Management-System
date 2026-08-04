import "./leave.css";
import LeaveTimeline from "./LeaveTimeline";

function LeaveDetails({ leave, updateLeaveStatus }) {
  if (!leave) {
    return (
      <div className="leave-details">
        <h2>Select a Leave Request</h2>
      </div>
    );
  }

  const from = new Date(leave.from_date);
  const to = new Date(leave.to_date);
  const totalDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

  function formatDate(date) {
    return new Date(date).toLocaleDateString(
      "en-GB",

      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  }

  return (
    <div className="leave-details">
      <div className="leave-details-header">
        <h2>Leave Details</h2>
      </div>

      <div className="leave-details-grid">
        <div className="detail-section">
          <h3>Student Information</h3>

          <div className="detail-grid">
            <div>
              <label>Student Name</label>

              <span>{leave.full_name}</span>
            </div>

            <div>
              <label>Register No.</label>

              <span>{leave.register_number}</span>
            </div>

            <div>
              <label>Department</label>

              <span>{leave.department}</span>
            </div>

            <div>
              <label>Year</label>

              <span>{leave.year}</span>
            </div>

            <div>
              <label>Room No.</label>

              <span>{leave.room_number}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Leave Information</h3>

          <div className="detail-grid">
            <div>
              <label>Leave Type</label>

              <span>{leave.leave_type}</span>
            </div>

            <div>
              <label>From Date</label>

              <span>{formatDate(leave.from_date)}</span>
            </div>

            <div>
              <label>To Date</label>

              <span>{formatDate(leave.to_date)}</span>
            </div>

            <div>
              <label>Total Days</label>

              <span className="days-badge">{totalDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reason-section">
        <h3>Reason</h3>

        <div className="reason-box">{leave.reason}</div>
      </div>

      <LeaveTimeline leave={leave} />

      {leave.status === "Pending" && (
        <div className="leave-actions">
          <button
            className="reject-btn"
            onClick={() => updateLeaveStatus("Rejected")}
          >
            Reject
          </button>

          <button
            className="approve-btn"
            onClick={() => updateLeaveStatus("Approved")}
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

export default LeaveDetails;