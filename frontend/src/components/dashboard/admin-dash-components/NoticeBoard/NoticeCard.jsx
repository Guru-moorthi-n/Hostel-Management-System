import "./notice.css";
import {
  FaBullhorn,
  FaMoneyBillWave,
  FaTools,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaThumbtack,
} from "react-icons/fa";

function NoticeCard({ notice, onClick }) {
  function getIcon() {
    switch (notice.type) {
      case "Fee":
        return <FaMoneyBillWave />;

      case "Maintenance":
        return <FaTools />;

      case "Event":
        return <FaCalendarAlt />;

      case "Emergency":
        return <FaExclamationTriangle />;

      default:
        return <FaBullhorn />;
    }
  }

  return (
    <div className="notice-card" onClick={onClick}>
      {notice.is_pinned && (
        <span className="notice-pin">
          <FaThumbtack />
        </span>
      )}

      <div className="notice-Icon">{getIcon()} <span className="notice-type">{notice.type}</span></div>

      <h3>{notice.title}</h3>

      <p>
        {notice.description.length > 90
          ? notice.description.substring(0, 90) + "..."
          : notice.description}
      </p>

      <div className="notice-footer">
        <span className="notice-date">
          {new Date(notice.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <span className="notice-read">Read More →</span>
      </div>
    </div>
  );
}

export default NoticeCard;
