import "./dashboard.css";

function StudentComplaintDetails({ complaint, onClose }) {
  if (!complaint) return null;

  return (
    <div className="modal-overlay">
      <div className="student-modal complaint-view-modal">
        <div className="modal-header">
          <h2>Complaint Details</h2>

          <button onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="complaint-view-body">
          <div className="complaint-status-row">
            <span>Status</span>

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

          <div className="complaint-info">
            <label>Title</label>
            <p>{complaint.title}</p>
          </div>

          <div className="complaint-grid">
            <div>
              <label>Category</label>

              <p>{complaint.category}</p>
            </div>

            <div>
              <label>Priority</label>

              <p>{complaint.priority}</p>
            </div>
          </div>

          <div className="complaint-info">
            <label>Room</label>

            <p>{complaint.room_number || "-"}</p>
          </div>

          <div className="complaint-info">
            <label>Assigned Warden</label>

            <p>{complaint.assigned_warden || "Not Assigned"}</p>
          </div>

          <div className="complaint-info">
            <label>Description</label>

            <div className="complaint-description">{complaint.description}</div>
          </div>

          <div className="complaint-info">
            <label>Submitted On</label>

            <p>{new Date(complaint.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentComplaintDetails;