import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../api/api';
import toast from 'react-hot-toast';

const statusStyles = {
  APPLIED: { label: 'Applied', className: 'status-applied' },
  UNDER_REVIEW: { label: 'Under Review', className: 'status-review' },
  SHORTLISTED: { label: 'Shortlisted', className: 'status-shortlisted' },
  REJECTED: { label: 'Not Selected', className: 'status-rejected' },
  SELECTED: { label: 'Selected 🎉', className: 'status-selected' },
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    applicationsAPI.getMyApplications()
      .then((res) => setApplications(res.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL'
    ? applications
    : applications.filter((a) => a.status === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>{applications.length} total applications</p>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {['ALL', 'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED'].map((s) => (
          <button
            key={s}
            className={`tab-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? 'All' : statusStyles[s]?.label}
            <span className="tab-count">
              {s === 'ALL' ? applications.length : applications.filter(a => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No applications found</h3>
          <p>
            {filter === 'ALL'
              ? <Link to="/jobs">Browse jobs to get started →</Link>
              : 'No applications with this status'}
          </p>
        </div>
      ) : (
        <div className="applications-list">
          {filtered.map((app) => {
            const status = statusStyles[app.status] || { label: app.status, className: '' };
            return (
              <div key={app.id} className="application-card">
                <div className="application-main">
                  <div className="application-info">
                    <h3>{app.jobTitle}</h3>
                    <p className="company">{app.companyName}</p>
                    <p className="applied-date">
                      Applied on {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    {app.coverLetter && (
                      <p className="cover-preview">
                        "{app.coverLetter.substring(0, 80)}..."
                      </p>
                    )}
                  </div>
                  <div className="application-status">
                    <span className={`status-badge ${status.className}`}>
                      {status.label}
                    </span>
                    <div className="status-timeline">
                      {['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED'].map((s, i) => (
                        <div
                          key={s}
                          className={`timeline-dot ${
                            ['APPLIED','UNDER_REVIEW','SHORTLISTED','SELECTED'].indexOf(app.status) >= i
                            ? 'completed' : ''
                          } ${app.status === 'REJECTED' ? 'rejected' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;