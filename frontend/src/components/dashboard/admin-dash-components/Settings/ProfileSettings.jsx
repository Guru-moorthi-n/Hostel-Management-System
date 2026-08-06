import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import API from "../../../../config/api";
import { useToast } from "../../../ToastContext";

function ProfileSettings() {
  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const username = localStorage.getItem("username");

    const response = await fetch(
      `${API}/api/profile/${username}`,
    );

    const data = await response.json();

    if (data.success) {
      setProfile({
        ...data.profile,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setOriginalProfile(data.profile);
    }
  }

  function handleChange(e) {
    setProfile({
      ...profile,

      [e.target.name]: e.target.value,
    });

    setShowSaveButton(true);
  }

  async function changePassword() {
    if (profile.newPassword !== profile.confirmPassword) {
      showToast("error", "Passwords do not match.", "");
      return;
    }

    const username = localStorage.getItem("username");

    const response = await fetch(
      `${API}/api/profile/change-password/${username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword,
        }),
      },
    );

    const data = await response.json();

    showToast("success", data.message, "");
  }

  async function saveProfile() {
    const username = localStorage.getItem("username");

    if (
      profile.full_name === originalProfile.full_name &&
      profile.email === originalProfile.email &&
      profile.phone === originalProfile.phone
    ) {
      showToast("error", "No changes detected.", "");
      setShowSaveButton(false);
      return;
    }

    const response = await fetch(
      `${API}/api/profile/${username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
        }),
      },
    );

    const data = await response.json();

    showToast("success", data.message, "");

    if (data.success) {
      setShowSaveButton(false);
    }

    setOriginalProfile({
      full_name: profile.full_name,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
    });
  }

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <FaUser />
        </div>

        <div>
          <h2>Profile Settings</h2>

          <p>Update administrator account details.</p>
        </div>
      </div>

      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label>Full Name</label>

          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="settings-form-group">
          <label>Username</label>

          <input
            type="text"
            name="username"
            value={profile.username}
            readOnly
          />
        </div>

        <div className="settings-form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>

        <div className="settings-form-group">
          <label>Current Password</label>

          <input
            type="password"
            name="currentPassword"
            value={profile.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="settings-form-group">
          <label>Phone Number</label>

          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>

        <div className="settings-form-group">
          <label>New Password</label>

          <input
            type="password"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleChange}
          />
        </div>

        <div></div>

        <div className="settings-form-group">
          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      {showSaveButton && (
        <button
          className="Primary-Btn"
          onClick={async () => {
            if (profile.newPassword) {
              await changePassword();
            }

            await saveProfile();
          }}
        >
          Save Changes
        </button>
      )}
    </div>
  );
}

export default ProfileSettings;