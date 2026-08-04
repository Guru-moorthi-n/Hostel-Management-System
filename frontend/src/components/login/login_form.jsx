import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ToastContext";
import API from "../../config/api.js";

const LoginForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { value, name } = event.target;

    setErrorMessage("");
    // setShowToast(false);

    setUserDetails((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  async function handleClick(event) {
    event.preventDefault();

    const response = await fetch(`${API}/api/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userDetails),
    });

    const data = await response.json();

    if (data.success) {
      showToast(
        "success",
        "Login Successful",
        "",
      );

      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("full_name", data.full_name);
        localStorage.setItem("user_id", data.user_id);

        setUserDetails({
          username: "",
          password: "",
          role: "",
        });

        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.role === "warden") {
          navigate("/warden-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }, 1200);
    } else {
      setErrorMessage(data.message);
      setUserDetails((prev) => {
        return {
          ...prev,
          password: "",
        };
      });
      return;
    }
  }

  return (
    <form className="form" onSubmit={handleClick}>
      <div className="input-group">
        <i className="fa-solid fa-users input-icon"></i>

        <select
          name="role"
          value={userDetails.role}
          onChange={handleChange}
          className="role-select"
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="warden">Warden</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div className="input-group">
        <i className="fa-solid fa-user input-icon"></i>
        <input
          onChange={handleChange}
          name="username"
          value={userDetails.username}
          type="text"
          className="form-field"
          placeholder="Username"
          minLength={4}
          maxLength={20}
          required
        />
      </div>

      <div className="input-group">
        <i className="fa-solid fa-lock input-icon"></i>
        <input
          onChange={handleChange}
          name="password"
          value={userDetails.password}
          type="password"
          className="form-field"
          placeholder="Password"
          minLength={4}
          maxLength={14}
          required
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button type="submit" className="login-btn" disabled={!userDetails.role}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;