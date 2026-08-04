import { FaInfoCircle } from "react-icons/fa";

function SystemInfo() {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <FaInfoCircle />
        </div>

        <div>
          <h2>System Information</h2>

          <p>View system and application information.</p>
        </div>
      </div>

      <div className="system-info-grid">
        <div className="system-info-item">
          <label>Application</label>
          <p>Hostel Management System</p>
        </div>

        <div className="system-info-item">
          <label>Frontend</label>
          <p>React</p>
        </div>

        <div className="system-info-item">
          <label>Version</label>
          <p>v1.0.0</p>
        </div>

        <div className="system-info-item">
          <label>Backend</label>
          <p>Node.js + Express</p>
        </div>

        <div className="system-info-item">
          <label>Build Date</label>
          <p>July 2026</p>
        </div>

        <div className="system-info-item">
          <label>Database</label>
          <p>PostgreSQL</p>
        </div>

        <div className="system-info-item">
          <label>Last Updated</label>
          <p>July 2026</p>
        </div>

        <div className="system-info-item">
          <label>Developed By</label>
          <p>Guru Moorthi</p>
        </div>
      </div>
    </div>
  );
}

export default SystemInfo;