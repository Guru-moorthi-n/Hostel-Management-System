import "./settings.css";

import ProfileSettings from "./ProfileSettings";
import HostelSettings from "./HostelSettings";
import AppearanceSettings from "./AppearanceSettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";
import SystemInfo from "./SystemInfo";

function Settings() {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>

        <p>Manage hostel configuration and application preferences.</p>
      </div>

      <div className="settings-grid">
        <ProfileSettings />
        <HostelSettings />
        <AppearanceSettings />
        {/* <NotificationSettings /> */}
        <SecuritySettings />
        <SystemInfo /> 
      </div>
    </div>
  );
}

export default Settings;
