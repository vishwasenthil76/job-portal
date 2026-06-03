import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../api/api';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationsAPI.getStats(),
      applicationsAPI.getMyApplications()
    ]).then(([statsRes, appsRes]) => {
      setStats(statsRes.data);
      setApplications(appsRes.data);
    }).catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats ? [
    { name: 'Applied', value: stats.pending },
    { name: 'Selected', value: stats.selected },
    { name: 'Shortlisted', value: stats.shortlisted },
  ].filter(d => d.value > 0) : [];

  const barData = applications.reduce((acc, app) => {
    const month = new Date(app.appliedAt).toLocaleString('default', { month: 'short' });
    const existing = acc.find(a => a.month === month);
    if (existing) existing.count++;
    else acc.push({ month, count: 1 });
    return acc;
  }, []);

  const statusColor = {
    APPLIED: 'status-applied',
    UNDER_REVIEW: 'status-review',
    SHORTLISTED: 'status-shortlisted',
    REJECTED: 'status-rejected',
    SELECTED: 'status-selected',
  };

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Here's your job search overview</p>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value">{stats?.pending || 0}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{stats?.shortlisted || 0}</div>
          <div className="stat-label">Shortlisted</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{stats?.selected || 0}</div>
          <div className="stat-label">Selected</div>
        </div>
      </div>

      {/* Charts */}
      {applications.length > 0 && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Application Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Applications Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent applications */}
      <div className="recent-section">
        <div className="section-header">
          <h3>Recent Applications</h3>
          <Link to="/my-applications" className="see-all">View all →</Link>
        </div>
        <div className="applications-table">
          {applications.slice(0, 5).map((app) => (
            <div key={app.id} className="app-row">
              <div className="app-info">
                <strong>{app.jobTitle}</strong>
                <span>{app.companyName}</span>
              </div>
              <div className="app-date">
                {new Date(app.appliedAt).toLocaleDateString()}
              </div>
              <span className={`status-badge ${statusColor[app.status]}`}>
                {app.status.replace('_', ' ')}
              </span>
            </div>
          ))}
          {applications.length === 0 && (
            <div className="empty-state">
              <p>No applications yet. <Link to="/jobs">Browse jobs →</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;