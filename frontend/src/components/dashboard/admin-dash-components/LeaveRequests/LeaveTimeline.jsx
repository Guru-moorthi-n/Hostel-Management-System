import {
  FaClipboardList,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "./leave.css";

function LeaveTimeline({ leave }) {
  const completed = leave.status !== "Pending";

  const finished = leave.status === "Approved" || leave.status === "Rejected";

  return (
    <div className="timeline-wrapper">
      <h3>Timeline</h3>

      <div className="leave-timeline">
        <div className="timeline-item completed">
          <div className="timeline-icon">
            <FaClipboardList />
          </div>

          <div>
            <h4>Leave Requested</h4>

            <p>Student submitted the request.</p>
          </div>
        </div>

        <div className={`timeline-item ${completed ? "completed" : ""}`}>
          <div className="timeline-icon">
            <FaSearch />
          </div>

          <div>
            <h4>Under Review</h4>

            <p>Waiting for admin decision.</p>
          </div>
        </div>

        <div className={`timeline-item ${finished ? "completed" : ""}`}>
          <div className="timeline-icon">
            {leave.status === "Approved" ? (
              <FaCheckCircle />
            ) : (
              <FaTimesCircle />
            )}
          </div>

          <div>
            <h4>{leave.status}</h4>

            <p>Final decision recorded.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveTimeline;