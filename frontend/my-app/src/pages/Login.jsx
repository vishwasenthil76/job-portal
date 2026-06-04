import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import toast from 'react-hot-toast';
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/jobs';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
     if (res.data.role === 'RECRUITER') {
  navigate('/recruiter/dashboard', { replace: true });
} else {
  navigate('/jobs', { replace: true });
}
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-page">
    <div className="login-container">

      {/* Left Side */}
      <div className="login-left">
        <h1>Find Your Dream Job</h1>
        <p>
          Connect with top companies, discover exciting opportunities,
          and take the next step in your career journey.
        </p>

        <div className="features">
          <div className="feature">
            🚀 Thousands of Jobs
          </div>

          <div className="feature">
            🏢 Top Companies
          </div>

          <div className="feature">
            💼 Easy Applications
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-card">

        <div className="auth-header">
          <h2>Welcome Back 👋</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="google-btn">
          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account?
          <Link to="/register">Create one</Link>
        </p>

      </div>
    </div>
  </div>
  );
};
export default Login;