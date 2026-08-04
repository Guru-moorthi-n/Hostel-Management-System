import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ToastContext";
import API from "../../config/api";

const Signup_form = () => {
  const navigate = useNavigate();
  const currentUserRole = localStorage.getItem("role");
  const { showToast } = useToast();

  const [userDetails, setUserDetails] = useState({
    full_name: "",
    username: "",
    password: "",
    confirm_password: "",
    role: currentUserRole === "warden" ? "student" : "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { value, name } = event.target;

    setErrorMessage("");

    setUserDetails((prevValue) => {
      return {
        ...prevValue,
        [name]:
          name === "username" || name === "full_name"
            ? value.trimStart()
            : value,
      };
    });
  }

  async function handleClick(event) {
    event.preventDefault();

    const username = userDetails.username.trim();
    const password = userDetails.password.trim();
    const full_name = userDetails.full_name.trim();

    if (!full_name || !username || !password) {
      setErrorMessage("Fields cannot be empty.");
      return;
    }

    if (username.includes(" ")) {
      setErrorMessage("Username cannot contain spaces.");
      return;
    }

    const response = await fetch(`${API}/api/add-user`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...userDetails,

        full_name: userDetails.full_name.trim(),
      }),
    });

    const data = await response.json();
    if (!data.success) {
      setErrorMessage(data.message);

      return;
    }

    // console.log();

    setUserDetails({
      full_name: "",
      username: "",
      password: "",
      confirm_password: "",
      role: currentUserRole === "warden" ? "student" : "",
    });

    showToast("success", "Account Created", "");
  }

  const passwordMatch = userDetails.password === userDetails.confirm_password;

  return (
    <form className="form" onSubmit={handleClick}>
      <div className="input-group">
        <i className="fa-solid fa-users input-icon"></i>

        <select
          onChange={handleChange}
          name="role"
          value={userDetails.role}
          className="role-select"
          disabled={currentUserRole === "warden"}
          required
        >
          {currentUserRole === "admin" ? (
            <>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="warden">Warden</option>
              <option value="student">Student</option>
            </>
          ) : (
            <>
              <option value="student">Student</option>
            </>
          )}
        </select>
      </div>

      <div className="input-group">
        <i className="fa-regular fa-address-card input-icon"></i>
        <input
          type="text"
          name="full_name"
          className="form-field"
          placeholder="Enter Full Name"
          value={userDetails.full_name}
          onChange={handleChange}
          maxLength={40}
          required
        />
      </div>

      <div className="input-group">
        <i className="fa-solid fa-user input-icon"></i>
        <input
          onChange={handleChange}
          name="username"
          value={userDetails.username}
          type="text"
          className="form-field"
          placeholder="Create Username (Max. 20 characters)"
          minLength={4}
          maxLength={20}
          required
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="input-group">
        <i className="fa-solid fa-lock input-icon"></i>
        <input
          onChange={handleChange}
          name="password"
          value={userDetails.password}
          className="form-field"
          placeholder="Enter Password  (Max. 14 characters)"
          minLength={4}
          maxLength={14}
          required
        />
      </div>

      <div className="input-group">
        <i className="fa-solid fa-shield-halved input-icon"></i>
        <input
          onChange={handleChange}
          name="confirm_password"
          value={userDetails.confirm_password}
          className="form-field"
          placeholder="Confirm Password"
          type="password"
          minLength={4}
          maxLength={14}
          required
        />
      </div>

      {userDetails.confirm_password && !passwordMatch && (
        <p className="error-message">Password does not match</p>
      )}

      <button
        type="submit"
        className="signup-btn"
        disabled={!passwordMatch || !userDetails.role}
      >
        Create
      </button>
    </form>
  );
};

export default Signup_form;