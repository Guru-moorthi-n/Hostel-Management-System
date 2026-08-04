import React from "react";

function NotificationModal({ notifications, onClose }) {
  return (
    <div className="notification-overlay">
      <div className="notification-modal">
        <div className="notification-header">
          <h3>Notifications</h3>

          <button onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <i className="fas fa-bell-slash"></i>

              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-icon">
                  {notification.type === "notice" ? (
                    <i className="fas fa-bullhorn"></i>
                  ) : notification.type === "complaint" ? (
                    <i className="fas fa-tools"></i>
                  ) : (
                    <i className="fas fa-calendar-check"></i>
                  )}
                </div>

                <div className="notification-content">
                  <h4>{notification.title}</h4>

                  <p>{notification.message}</p>

                  <small>
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;