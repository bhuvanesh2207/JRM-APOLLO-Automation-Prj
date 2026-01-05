import React, { useState } from "react";
import "../assets/css/login.css";
import LoginPage from "../assets/images/LoginPage.avif";

<img src={LoginPage} alt="Background" className="bg-image" />;

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">
        {/* --- Left Side (Image & Overlay) --- */}
        <div className="login-left">
          {/* Change this src to your actual image path */}
          <img src={LoginPage} alt="Background" className="bg-image" />
          <div className="overlay"></div>
        </div>

        {/* --- Right Side (Form) --- */}
        <div className="login-right">
          {/* Logo */}
          <div className="brand-logo">
            <span className="brand-text">JRM / APOLLO</span>
          </div>

          {/* Welcome Text */}
          <div className="header-text">
            <h4>
              Welcome to <span>Admin Login</span>
            </h4>
            <p>Sign in to continue to Dashboard.</p>
          </div>

          <form>
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  placeholder="Enter username"
                  className="form-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter password"
                  className="form-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {/* Eye Icon SVG */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <a href="#" className="forgot-link">
                {/* Lock Icon SVG */}
                <svg
                  width="12"
                  height="12"
                  style={{ marginRight: "5px" }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 10c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z" />
                </svg>
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="btn-submit-container">
              <button type="submit" className="btn-submit">
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
