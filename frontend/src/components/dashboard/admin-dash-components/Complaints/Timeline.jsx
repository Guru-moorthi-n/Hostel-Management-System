import React from "react";
import "./complaints.css";

function Timeline({ complaint }) {
  return (
    <div className="timeline-section">
      <h3>Activity Timeline</h3>

      <div className="timeline">
        <div className="timeline-row">
          <div className="timeline-dot"></div>

          <div>
            <h4>Complaint Created</h4>

            <small>{new Date(complaint.created_at).toLocaleString()}</small>
          </div>
        </div>

        <div className="timeline-row">
          <div className="timeline-dot"></div>

          <div>
            <h4>Status : {complaint.status}</h4>

            <small>Latest Status</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
