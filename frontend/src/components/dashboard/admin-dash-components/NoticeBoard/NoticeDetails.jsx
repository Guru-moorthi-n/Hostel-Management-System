import { useState } from "react";
import {
  FaBullhorn,
  FaMoneyBillWave,
  FaTools,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaThumbtack,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

import AddNoticeModal from "./AddNoticeModal";
import "./notice.css";

function NoticeDetails({
  notice,
  refresh,
  onClose,
  onEdit,
  onDelete,
  readOnly = false,
}) {
  if (!notice) return null;

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
    <>
      <div className="notice-overlay" onClick={onClose}>
        <div className="notice-details" onClick={(e) => e.stopPropagation()}>
          <button className="notice-close-btn" onClick={onClose}>
            <FaTimes />
          </button>

          <div className="notice-details-icon">{getIcon()}</div>

          <div className="notice-details-header">
            <h2>{notice.title}</h2>

            {notice.is_pinned && (
              <span className="notice-pin-badge">
                <FaThumbtack />
                Pinned
              </span>
            )}
          </div>

          <div className="notice-info-grid">
            <div>
              <label>Type</label>

              <p>{notice.type}</p>
            </div>

            <div>
              <label>Created</label>

              <p>{new Date(notice.created_at).toLocaleDateString("en-GB")}</p>
            </div>

            <div>
              <label>Updated</label>

              <p>{new Date(notice.updated_at).toLocaleDateString("en-GB")}</p>
            </div>
          </div>

          <div className="notice-description">
            <h3>Description</h3>

            <p>{notice.description}</p>
          </div>

          {!readOnly && (
            <div className="notice-actions">
              <button className="edit-btn" onClick={() => onEdit(notice)}>
                <FaEdit />
                Edit
              </button>

              <button className="delete-btn" onClick={() => onDelete(notice)}>
                <FaTrash />
                Delete
              </button>
            </div>
          )}
          {readOnly && (
            <div className="notice-actions">
              <button className="student-outline-btn" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NoticeDetails;