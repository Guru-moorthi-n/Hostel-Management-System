import React from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import Signup_form from "./signup_form";
import Footer from "../Footer";

const Signup = (props) => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  function handleClose() {
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/warden-dashboard");
    }
  }

  return (
    <div>
      <div className="signup-container">
        <div className="signup">
          <button className="signup-close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>

          <h1 className="signup-heading">{props.signup_heading}</h1>
          <Signup_form />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;