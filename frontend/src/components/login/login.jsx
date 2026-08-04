import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import LoginForm from "./login_form";
import Footer from "../Footer";

const Login = (props) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="login-page">
      <div
        className="demo-login-wrapper"
        onMouseEnter={() => setShowDemo(true)}
        onMouseLeave={() => setShowDemo(false)}
        onClick={() => setShowDemo((prev) => !prev)}
      >
        <button className="demo-user-btn">
          <i className="fas fa-user"></i>
        </button>

        {showDemo && (
          <div className="demo-login-card">
            <h4>Demo Login Accounts</h4>

            <div className="demo-role">
              <strong>Warden</strong>

              <p>
                <span>Username</span> : TestWarden
              </p>
              <p>
                <span>Password</span> : Tw@123
              </p>
            </div>

            <div className="demo-divider"></div>

            <div className="demo-role">
              <strong>Student</strong>

              <p>
                <span>Username</span> : TestStudent
              </p>
              <p>
                <span>Password</span> : Ts@123
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="login-container">
        <div className="login">
          <h1 className="login-heading">{props.login_heading}</h1>

          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
