import React from "react";
import "./complaints.css";

function ComplaintCard({ complaint, selectedComplaint, setSelectedComplaint }) {
  const active = selectedComplaint?.id === complaint.id;

  return (
    <div
      className={active ? "complaint-card active" : "complaint-card"}
      onClick={() => setSelectedComplaint(complaint)}
    >
      <div className="complaint-card-header">
        <div className="complaint-ticket">
          <span className="ticket-dot"></span>

          <span className="ticket-number">#{complaint.id}</span>
        </div>

        <span
          className={`status-badge ${complaint.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {complaint.status}
        </span>
      </div>

      <h2 className="complaint-title">{complaint.title}</h2>

      <div className="complaint-meta">
        <span>{complaint.full_name}</span>

        <span>•</span>

        <span>{complaint.room_number || "No Room"}</span>

        <span>•</span>

        <span>{complaint.category}</span>
      </div>

      <p className="complaint-preview">{complaint.description}</p>

      <div className="complaint-footer">
        <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default ComplaintCard;
