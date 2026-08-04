import { FaShieldAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import API from "../../../../config/api";

function SecuritySettings() {
  const [settings, setSettings] = useState({
    auto_logout: true,
    session_timeout: "30 Minutes",
  });

  const [originalSettings, setOriginalSettings] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const response = await fetch(`${API}/api/hostel-settings`);

    const data = await response.json();

    if (data.success) {
      setSettings({
        auto_logout: data.settings.auto_logout,
        session_timeout: data.settings.session_timeout,
      });

      setOriginalSettings({
        auto_logout: data.settings.auto_logout,
        session_timeout: data.settings.session_timeout,
      });
    }
  }

  function handleChange(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setSettings({
      ...settings,

      [e.target.name]: value,
    });

    setShowSaveButton(true);
  }

  async function saveSettings() {
    if (
      settings.auto_logout === originalSettings.auto_logout &&
      settings.session_timeout === originalSettings.session_timeout
    ) {
      alert("No changes detected.");
      setShowSaveButton(false);

      return;
    }

    const hostelResponse = await fetch(
      `${API}/api/hostel-settings`,
    );

    const hostelData = await hostelResponse.json();

    const response = await fetch(
      `${API}/api/hostel-settings`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...hostelData.settings,
          auto_logout: settings.auto_logout,
          session_timeout: settings.session_timeout,
        }),
      },
    );

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      setOriginalSettings(settings);
      setShowSaveButton(false);
    }
  }

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <FaShieldAlt />
        </div>

        <div>
          <h2>Security Settings</h2>

          <p>Manage your security preferences.</p>
        </div>
      </div>

      <div className="security-grid">
        <div>
          <label className="settings-label">Auto Logout</label>

          <label className="security-checkbox">
            <input
              type="checkbox"
              name="auto_logout"
              checked={settings.auto_logout}
              onChange={handleChange}
            />

            <span>Enable Auto Logout</span>
          </label>

          <small>Automatically log out after a period of inactivity.</small>
        </div>

        <div>
          <label className="settings-label">Session Timeout</label>

          <select
            className="settings-select"
            name="session_timeout"
            value={settings.session_timeout}
            onChange={handleChange}
          >
            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>60 Minutes</option>
            <option>Never</option>
          </select>

          <small>Choose the inactivity duration before automatic logout.</small>
        </div>
      </div>

      {showSaveButton && (
        <button className="Primary-Btn" onClick={saveSettings}>
          Save Changes
        </button>
      )}
    </div>
  );
}

export default SecuritySettings;