import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../api/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicantCounts, setApplicantCounts] = useState({});

  useEffect(() => {
    jobsAPI.getMyJobs()
      .then(async (res) => {
        setJobs(res.data);
        // Fetch applicant count per job
        const counts = {};
        await Promise.all(res.data.map(async (job) => {
          try {
            const appsRes = await applicationsAPI.getJobApplicants(job.id);
            counts[job.id] = appsRes.data.length;
          } catch {
            counts[job.id] = 0;
          }
        }));
        setApplicantCounts(counts);
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const totalApplicants = Object.values(applicantCounts).reduce((a, b) => a + b, 0);
  const activeJobs = jobs.filter((j) => j.active).length;

  const chartData = jobs.slice(0, 8).map((j) => ({
    name: j.title.length > 15 ? j.title.substring(0, 15) + '...' : j.title,
    applicants: applicantCounts[j.id] || 0,
  }));

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Recruiter Dashboard</h1>
        <p>Manage your job postings and applicants</p>
        <Link to="/recruiter/post-job" className="btn-primary">+ Post New Job</Link>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-value">{jobs.length}</div>
          <div className="stat-label">Total Jobs Posted</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{activeJobs}</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{totalApplicants}</div>
          <div className="stat-label">Total Applicants</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value">
            {jobs.length > 0 ? Math.round(totalApplicants / jobs.length) : 0}
          </div>
          <div className="stat-label">Avg. per Job</div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="chart-card full-width">
          <h3>Applicants per Job</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applicants" fill="#8B5CF6" name="Applicants" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent jobs */}
      <div className="recent-section">
        <div className="section-header">
          <h3>Your Job Postings</h3>
          <Link to="/recruiter/manage-jobs" className="see-all">Manage all →</Link>
        </div>
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs posted yet. <Link to="/recruiter/post-job">Post your first job →</Link></p>
          </div>
        ) : (
          <div className="jobs-summary-list">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="job-summary-row">
                <div>
                  <strong>{job.title}</strong>
                  <span className="company">{job.companyName}</span>
                  <span className={`status-badge ${job.active ? 'status-active' : 'status-inactive'}`}>
                    {job.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="applicant-count">
                  <strong>{applicantCounts[job.id] || 0}</strong>
                  <span>applicants</span>
                </div>
                <Link to={`/recruiter/applicants/${job.id}`} className="btn-outline small">
                  View Applicants
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;