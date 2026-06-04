import React, { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isRecruiter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "nav-link active"
      : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-brand">
  <span className="brand-icon">💼</span>
  <span className="brand-text">JobConnect</span>
</Link>

        {/* Mobile Menu Button */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation */}
        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>

          {/* Recruiter Links */}
          {user && isRecruiter() && (
            <>
              <Link
                to="/recruiter/dashboard"
                className={isActive("/recruiter/dashboard")}
              >
                Dashboard
              </Link>

              <Link
                to="/recruiter/post-job"
                className={isActive("/recruiter/post-job")}
              >
                Post Job
              </Link>

              <Link
                to="/recruiter/manage-jobs"
                className={isActive("/recruiter/manage-jobs")}
              >
                Manage Jobs
              </Link>
            </>
          )}

          {/* Job Seeker Links */}
          {user && !isRecruiter() && (
            <>
              <Link to="/" className={isActive("/")}>
                Browse Jobs
              </Link>

              <Link
                to="/dashboard"
                className={isActive("/dashboard")}
              >
                Dashboard
              </Link>

              <Link
                to="/applications"
                className={isActive("/applications")}
              >
                Applications
              </Link>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="nav-auth">
          {user ? (
            <>
              <div className="user-info">
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="user-name">{user.name}</p>
                  <p className="user-role">
                    {user.role === "RECRUITER"
                      ? "Recruiter"
                      : "Job Seeker"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;