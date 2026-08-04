import "./leave.css";

function LeaveCard({ leave, selected, onClick }) {
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getDays() {
    const from = new Date(leave.from_date);

    const to = new Date(leave.to_date);

    return Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
  }

  return (
    <div className={`leave-card ${selected ? "active" : ""}`} onClick={onClick}>
      <div className="leave-card-row">
        <div className="leave-avatar">
          {leave.full_name.charAt(0).toUpperCase()}
        </div>

        <div className="leave-card-info">
          <h3>{leave.full_name}</h3>

          <p>{leave.leave_type}</p>

          <span>
            {formatDate(leave.from_date)}

            {" - "}

            {formatDate(leave.to_date)}
          </span>
        </div>

        <span className={`leave-status ${leave.status.toLowerCase()}`}>
          {leave.status}
        </span>
      </div>

      <div className="leave-card-footer">
        <span>{leave.department}</span>

        <span>Room {leave.room_number}</span>

        <span>
          {getDays()} Day{getDays() > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default LeaveCard;
