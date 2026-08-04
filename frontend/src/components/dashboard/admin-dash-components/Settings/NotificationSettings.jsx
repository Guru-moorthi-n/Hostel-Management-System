import { FaBell } from "react-icons/fa";

function NotificationSettings() {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <FaBell />
        </div>

        <div>
          <h2>Notification Settings</h2>

          <p>Choose which notifications you want to receive.</p>
        </div>
      </div>

      <div className="notification-list">
        <label className="notification-item">
          <input type="checkbox" defaultChecked />

          <div>
            <h4>Complaint Notifications</h4>

            <p>Receive notifications for new and updated complaints.</p>
          </div>
        </label>

        <label className="notification-item">
          <input type="checkbox" defaultChecked />

          <div>
            <h4>Leave Request Notifications</h4>

            <p>Receive notifications for new leave requests.</p>
          </div>
        </label>

        <label className="notification-item">
          <input type="checkbox" defaultChecked />

          <div>
            <h4>Fee Due Notifications</h4>

            <p>Receive notifications for fee due reminders.</p>
          </div>
        </label>

        <label className="notification-item">
          <input type="checkbox" defaultChecked />

          <div>
            <h4>Notice Board Notifications</h4>

            <p>Receive notifications for newly published notices.</p>
          </div>
        </label>
      </div>

      <button className="Primary-Btn">Save Preferences</button>
    </div>
  );
}

export default NotificationSettings;
