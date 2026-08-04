import React, { useEffect } from "react";
import "./dashboard/dashboard.css"

function Toast({ show, title, message, type = "success", onClose }) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div className={`toast ${type}`}>
      <div className="toast-icon">
        {type === "success" ? (
          <i className="fas fa-circle-check"></i>
        ) : type === "error" ? (
          <i className="fas fa-circle-xmark"></i>
        ) : (
          <i className="fas fa-circle-info"></i>
        )}
      </div>

      <div className="toast-body">
        <h4>{title}</h4>

        <p>{message}</p>
      </div>

      <button className="toast-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}

export default Toast;