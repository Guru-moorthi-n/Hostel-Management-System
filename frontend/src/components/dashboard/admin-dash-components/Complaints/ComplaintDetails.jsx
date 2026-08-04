import React from "react";
import Timeline from "./Timeline";
import "./complaints.css";

function ComplaintDetails({
  complaint,
  onStatusChange,
  onDelete,
  onAssign,
  readOnly = false,
}) {
  if (!complaint) {
    return (
      <div className="complaint-details">
        <div className="empty-details">
          <h2>Select a Complaint</h2>
          <p>Select a complaint from the left panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-details">
      <div className="details-header">
        <h2>Complaint #{complaint.id}</h2>

        <span
          className={`status-badge ${complaint.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {complaint.status}
        </span>
      </div>

      <div className="details-section">
        <h3>Details</h3>

        <div className="details-grid">
          <div className="detail-item">
            <i className="fas fa-user"></i>

            <div>
              <label>Student</label>

              <p>{complaint.full_name}</p>
            </div>
          </div>

          <div className="detail-item">
            <i className="far fa-clipboard"></i>

            <div>
              <label>Status</label>

              <p>{complaint.status}</p>
            </div>
          </div>

          <div className="detail-item">
            <i className="fas fa-bed"></i>

            <div>
              <label>Room</label>

              <p>{complaint.room_number || "-"}</p>
            </div>
          </div>

          <div className="detail-item">
            <i className="fas fa-user-check"></i>

            <div>
              <label>Assigned To</label>

              <p>{complaint.assigned_warden || "Not Assigned"}</p>
            </div>
          </div>

          <div className="detail-item">
            <i className="fas fa-tag"></i>

            <div>
              <label>Category</label>

              <p>{complaint.category}</p>
            </div>
          </div>

          <div className="detail-item">
            <i className="far fa-calendar"></i>

            <div>
              <label>Created</label>

              <p>{new Date(complaint.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="detail-item">
            <i className="fas fa-exclamation-circle"></i>

            <div>
              <label>Priority</label>

              <p>{complaint.priority}</p>
            </div>
          </div>

          <div className="detail-item">
            <i className="far fa-clock"></i>

            <div>
              <label>Updated</label>

              <p>
                {new Date(
                  complaint.updated_at || complaint.created_at,
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="description-section">
        <h3>Description</h3>

        <p>{complaint.description}</p>
      </div>

      <Timeline complaint={complaint} />

      {!readOnly && (
        <div className="details-actions">
          <button className="assign-btn" onClick={onAssign}>
            <i className="fas fa-user-plus"></i>
            Assign Warden
          </button>

          <button
            className="progress-btn"
            disabled={
              complaint.status === "In Progress" ||
              complaint.status === "Resolved"
            }
            onClick={() => onStatusChange("In Progress")}
          >
            <i className="fas fa-play"></i>
            Mark In Progress
          </button>

          <button
            className="resolve-btn"
            disabled={complaint.status === "Resolved"}
            onClick={() => onStatusChange("Resolved")}
          >
            <i className="fas fa-check"></i>
            Resolve
          </button>

          <button className="delete-Btn" onClick={onDelete}>
            <i className="fas fa-trash"></i>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ComplaintDetails;