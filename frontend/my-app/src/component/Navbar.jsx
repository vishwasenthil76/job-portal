import React, { useState } from 'react';
import "./Navbar.css";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isRecruiter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💼</span>
          JobPortal
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>

          {user && isRecruiter() && (
            <>
              <Link to="/recruiter/dashboard" className={isActive('/recruiter/dashboard')}>Dashboard</Link>
              <Link to="/recruiter/post-job" className={isActive('/recruiter/post-job')}>Post Job</Link>
              <Link to="/recruiter/manage-jobs" className={isActive('/recruiter/manage-jobs')}>Manage Jobs</Link>
            </>
          )}

          {user && !isRecruiter() && (
            <>
              <Link to="/">Browse Jobs</Link>

<Link to="/dashboard">Dashboard</Link>

<Link to="/applications">My Applications</Link>

<Link to="/recruiter">Dashboard</Link>
            </>
          )}

          <div className="nav-auth">
            {user ? (
              <div className="user-menu">
                <span className="user-name">👤 {user.name}</span>
                <span className="user-role">{user.role === 'RECRUITER' ? 'Recruiter' : 'Job Seeker'}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;