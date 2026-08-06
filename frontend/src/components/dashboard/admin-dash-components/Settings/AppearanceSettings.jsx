import { useEffect, useState } from "react";
import { FaPalette, FaSun, FaMoon } from "react-icons/fa";
import { useToast } from "../../../ToastContext";

function AppearanceSettings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { showToast } = useToast();

  const [originalTheme, setOriginalTheme] = useState(
    localStorage.getItem("theme") || "light",
  );

  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function handleThemeChange(e) {
    setTheme(e.target.value);
    setShowSaveButton(e.target.value !== originalTheme);
  }

  function saveTheme() {
    if (theme === originalTheme) {
      showToast("error", "No changes detected.", "");
      setShowSaveButton(false);
      return;
    }

    localStorage.setItem("theme", theme);

    setOriginalTheme(theme);
    setShowSaveButton(false);
    showToast("success", "Theme updated successfully.", "");
    window.location.reload();
  }

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <FaPalette />
        </div>

        <div>
          <h2>Appearance</h2>

          <p>Choose your preferred application theme.</p>
        </div>
      </div>

      <div className="settings-form-group">
        <label>Theme</label>

        <div className="theme-options">
          <label className={`theme-card ${theme === "light" ? "active" : ""}`}>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={handleThemeChange}
            />

            <FaSun />

            <span>Light Mode</span>
          </label>

          <label className={`theme-card ${theme === "dark" ? "active" : ""}`}>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={handleThemeChange}
            />

            <FaMoon />

            <span>Dark Mode</span>
          </label>
        </div>
      </div>

      {showSaveButton && (
        <button className="Primary-Btn" onClick={saveTheme}>
          Save Preference
        </button>
      )}
    </div>
  );
}

export default AppearanceSettings;