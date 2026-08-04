import { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import API from "../../../../config/api";

function HostelSettings() {
  const [settings, setSettings] = useState({
    hostel_name: "",
    warden_name: "",
    address: "",
    phone: "",
    email: "",
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
      setSettings(data.settings);
      setOriginalSettings(data.settings);
    }
  }

  function handleChange(e) {
    setSettings({
      ...settings,

      [e.target.name]: e.target.value,
    });

    setShowSaveButton(true);
  }

  async function saveSettings() {
    if (
      settings.hostel_name === originalSettings.hostel_name &&
      settings.warden_name === originalSettings.warden_name &&
      settings.address === originalSettings.address &&
      settings.phone === originalSettings.phone &&
      settings.email === originalSettings.email
    ) {
      alert("No changes detected.");

      setShowSaveButton(false);
      return;
    }

    const response = await fetch(
      `${API}/api/hostel-settings`,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(settings),
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
          <FaBuilding />
        </div>

        <div>
          <h2>Hostel Information</h2>

          <p>Manage hostel details and contact information.</p>
        </div>
      </div>

      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label>Hostel Name</label>

          <input
            type="text"
            name="hostel_name"
            value={settings.hostel_name}
            onChange={handleChange}
            placeholder="Enter hostel name"
          />
        </div>

        <div className="settings-form-group">
          <label>Warden Name</label>

          <input
            type="text"
            name="warden_name"
            value={settings.warden_name}
            onChange={handleChange}
            placeholder="Enter warden name"
          />
        </div>

        <div className="settings-form-group">
          <label>Address</label>

          <textarea
            rows="5"
            name="address"
            value={settings.address}
            onChange={handleChange}
            placeholder="Enter hostel address"
          />
        </div>

        <div>
          <div className="settings-form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="settings-form-group" style={{ marginTop: "18px" }}>
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
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

export default HostelSettings;