import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobsAPI, applicationsAPI } from "../api/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from "recharts";
import toast from "react-hot-toast";

import "./RecruiterDashboard.css";
import {
    FiBriefcase,
    FiUsers,
    FiCheckCircle,
    FiTrendingUp,
    FiBell,
    FiCalendar,
    FiAward,
    FiPieChart
} from "react-icons/fi";

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [applicantCounts, setApplicantCounts] = useState({});
  const topJob =
  jobs.length > 0
    ? jobs.reduce((best, current) =>
        (applicantCounts[current.id] || 0) >
        (applicantCounts[best.id] || 0)
          ? current
          : best
      )
    : null;
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [searchApplicant, setSearchApplicant] = useState("");
  const [statusFilter,setStatusFilter]=useState("ALL");
  const [dark,setDark]=useState(false);

  <select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
>

<option value="ALL">All</option>

<option value="APPLIED">Applied</option>

<option value="UNDER_REVIEW">Under Review</option>

<option value="SHORTLISTED">Shortlisted</option>

<option value="SELECTED">Selected</option>

<option value="REJECTED">Rejected</option>

</select>



  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const jobsRes = await jobsAPI.getMyJobs();

      const recruiterJobs = jobsRes.data;

      setJobs(recruiterJobs);

      const counts = {};
      let applicants = [];

      await Promise.all(
        recruiterJobs.map(async (job) => {
          try {
            const appRes = await applicationsAPI.getJobApplicants(job.id);

            counts[job.id] = appRes.data.length;

            applicants.push(...appRes.data);
          } catch (err) {
            counts[job.id] = 0;
          }
        })
      );

      applicants.sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
      );

      setRecentApplicants(applicants.slice(0, 5));

      setApplicantCounts(counts);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load recruiter dashboard");
    } finally {
      setLoading(false);
    }
  };

  const totalApplicants = Object.values(applicantCounts).reduce(
    (a, b) => a + b,
    0
  );

  const activeJobs = jobs.filter((job) => job.active).length;

  const averageApplicants =
    jobs.length === 0
      ? 0
      : Math.round(totalApplicants / jobs.length);

  const chartData = jobs.slice(0, 8).map((job) => ({
    name:
      job.title.length > 15
        ? job.title.substring(0, 15) + "..."
        : job.title,
    applicants: applicantCounts[job.id] || 0,
  }));

  const analytics = [
    {
      title: "Hiring Success",
      value:
        totalApplicants === 0
          ? 0
          : Math.round((activeJobs / totalApplicants) * 100),
      color: "#2563EB",
    },
    {
      title: "Jobs Filled",
      value:
        jobs.length === 0
          ? 0
          : Math.round(((jobs.length - activeJobs) / jobs.length) * 100),
      color: "#16A34A",
    },
    {
      title: "Open Positions",
      value:
        jobs.length === 0
          ? 0
          : Math.round((activeJobs / jobs.length) * 100),
      color: "#F59E0B",
    },
  ];

  if (loading) {
    return (
      <div className="page-loading">
        Loading Recruiter Dashboard...
      </div>
    );
  }

  const hiringTrend = [
  { month: "Jan", applicants: 18 },
  { month: "Feb", applicants: 25 },
  { month: "Mar", applicants: 42 },
  { month: "Apr", applicants: 36 },
  { month: "May", applicants: 51 },
  { month: "Jun", applicants: 64 },
  { month: "Jul", applicants: totalApplicants }
];

  return (
    <div className={darkMode ? "dashboard-page dark" : "dashboard-page"}>
      <div className="dashboard-header modern-header">

  <div>

    <h1>
      Welcome back, {user?.name} 👋
    </h1>

    <p>
      Here's an overview of your recruitment activities today.
    </p>

  </div>

  <Link
    to="/recruiter/post-job"
    className="post-job-btn"
  >
    + Post New Job
  </Link>

</div>

<div className="header-actions">

    <button
        className="dark-btn"
        onClick={() => setDarkMode(!darkMode)}
    >
        {darkMode ? "☀ Light" : "🌙 Dark"}
    </button>

    <button
        className="download-btn"
    >
        📄 Export Report
    </button>

    <Link
        to="/recruiter/post-job"
        className="post-job-btn"
    >
        + Post New Job
    </Link>

</div>

<div className="profile-card">

    <div className="profile-left">

        <div className="profile-avatar">
            {user?.name?.charAt(0)}
        </div>

        <div>

            <h2>{user?.name}</h2>

            <p>{user?.email}</p>

            <span className="role-badge">
                Recruiter
            </span>

        </div>

    </div>

    <div className="profile-right">

        <div className="mini-stat">

            <h2>{jobs.length}</h2>

            <p>Jobs Posted</p>

        </div>

        <div className="mini-stat">

            <h2>{totalApplicants}</h2>

            <p>Applicants</p>

        </div>

        <div className="mini-stat">

            <h2>{activeJobs}</h2>

            <p>Active Jobs</p>

        </div>

    </div>

</div>

{/* Statistics Cards */}

<div className="stats-grid">

    <div className="stat-card">
        <div className="stat-info">
            <h3>Total Jobs</h3>
            <h2>{jobs.length}</h2>
            <p>Jobs Posted</p>
        </div>

        <div className="stat-icon blue">
    <FiBriefcase />
</div>
    </div>

    <div className="stat-card">
        <div className="stat-info">
            <h3>Active Jobs</h3>
            <h2>{activeJobs}</h2>
            <p>Currently Hiring</p>
        </div>

        <div className="stat-icon green">
    <FiCheckCircle />
</div>
    </div>

    <div className="stat-card">
        <div className="stat-info">
            <h3>Applicants</h3>
            <h2>{totalApplicants}</h2>
            <p>Applications Received</p>
        </div>

        <div className="stat-icon orange">
    <FiUsers />
</div>
    </div>

    <div className="stat-card">
        <div className="stat-info">
            <h3>Avg / Job</h3>
            <h2>
                {jobs.length
                    ? Math.round(totalApplicants / jobs.length)
                    : 0}
            </h2>
            <p>Average Applicants</p>
        </div>

        <div className="stat-icon purple">
    <FiTrendingUp />
</div>
    </div>

</div>

<div className="activity-card">

    <div className="section-header">

        <h3>Recent Activity</h3>

    </div>

    <div className="activity-list">

        <div className="activity-item">

            <div className="activity-icon blue">📝</div>

            <div>
                <strong>Java Developer</strong>
                <p>Job posted successfully</p>
                <span>2 hours ago</span>
            </div>

        </div>

        <div className="activity-item">

            <div className="activity-icon green">👤</div>

            <div>
                <strong>Rahul Sharma</strong>
                <p>Applied for React Developer</p>
                <span>5 hours ago</span>
            </div>

        </div>

        <div className="activity-item">

            <div className="activity-icon orange">⭐</div>

            <div>
                <strong>Anjali Verma</strong>
                <p>Shortlisted</p>
                <span>Yesterday</span>
            </div>

        </div>

    </div>

</div>

<div className="quick-actions">

    <Link to="/recruiter/post-job" className="action-card">
        <div className="action-icon">
            📝
        </div>

        <h3>Post Job</h3>

        <p>
            Create a new hiring opportunity
        </p>
    </Link>

    <Link to="/recruiter/manage-jobs" className="action-card">
        <div className="action-icon">
            💼
        </div>

        <h3>Manage Jobs</h3>

        <p>
            Edit, pause or close job postings
        </p>
    </Link>

    <Link
        to={
            jobs.length > 0
                ? `/recruiter/applicants/${jobs[0].id}`
                : "#"
        }
        className="action-card"
    >
        <div className="action-icon">
            👥
        </div>

        <h3>Applicants</h3>

        <p>
            Review candidate profiles
        </p>
    </Link>

    <div className="action-card">

        <div className="action-icon">
            📊
        </div>

        <h3>Analytics</h3>

        <p>
            Track hiring performance
        </p>

    </div>

</div>

<div className="analytics-section">

    {analytics.map((item,index)=>(

        <div className="analytics-card" key={index}>

            <div
                className="circle"
                style={{
                    background:`conic-gradient(${item.color} ${item.value*3.6}deg,#eef2f7 0deg)`
                }}
            >

                <div className="circle-inner">

                    <h2>{item.value}%</h2>

                </div>

            </div>

            <h3>{item.title}</h3>

        </div>

    ))}

</div>

            {/* Applicants Chart */}
      {chartData.length > 0 && (
        <div className="chart-card">
          <div className="section-header">
            <h3>Applicants Per Job</h3>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="applicants"
                fill="#2563EB"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="trend-card">

    <div className="section-header">

        <h3>Monthly Hiring Trend</h3>

    </div>

    <ResponsiveContainer
        width="100%"
        height={320}
    >

        <LineChart data={hiringTrend}>

            <CartesianGrid strokeDasharray="4 4"/>

            <XAxis dataKey="month"/>

            <YAxis/>

            <Tooltip/>

            <Legend/>

            <Line
                type="monotone"
                dataKey="applicants"
                stroke="#2563EB"
                strokeWidth={4}
                dot={{r:5}}
                activeDot={{r:8}}
            />

        </LineChart>

    </ResponsiveContainer>

</div>


      {/* Recent Applicants */}

      {topJob && (

<div className="top-job-card">

    <div>

        <h2>🏆 Top Performing Job</h2>

        <h3>{topJob.title}</h3>

        <p>{topJob.companyName}</p>

    </div>

    <div className="top-job-stats">

        <div>

            <h1>{applicantCounts[topJob.id] || 0}</h1>

            <span>Applicants</span>

        </div>

        <div>

            <h1>{topJob.active ? "Active" : "Closed"}</h1>

            <span>Status</span>

        </div>

    </div>

</div>

)}

<div className="notification-card">

<h3>Notifications</h3>

<div className="notification">

🔔 New applicant applied for Java Developer

</div>

<div className="notification">

⭐ React Developer shortlisted

</div>

<div className="notification">

📅 Interview scheduled tomorrow

</div>

</div>

<div className="interview-card">

<h3>Today's Interviews</h3>

<div className="interview-row">

<div>

<strong>10:00 AM</strong>

<p>Rahul Sharma</p>

</div>

<span>Java Developer</span>

</div>

<div className="interview-row">

<div>

<strong>2:00 PM</strong>

<p>Priya Singh</p>

</div>

<span>React Developer</span>

</div>

</div>

<div className="performance-card">

<h3>Your Performance</h3>

<div className="performance-grid">

<div>

<h1>95%</h1>

<p>Response Rate</p>

</div>

<div>

<h1>12 Days</h1>

<p>Avg Hiring Time</p>

</div>

<div>

<h1>4.9 ⭐</h1>

<p>Recruiter Rating</p>

</div>

</div>

</div>
      <div className="recent-applicants-card">

        <div className="table-toolbar">

    <input
        type="text"
        placeholder="Search applicant..."
        value={searchApplicant}
        onChange={(e)=>setSearchApplicant(e.target.value)}
    />

</div>
        <div className="section-header">
          <h3>Recent Applicants</h3>
        </div>

        {recentApplicants.length === 0 ? (

          <div className="empty-state">
            No applicants yet.
          </div>

        ) : (

          

          <table className="applicant-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Job</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {recentApplicants.filter(app =>
    app.userName.toLowerCase().includes(searchApplicant.toLowerCase()) ||
    app.userEmail.toLowerCase().includes(searchApplicant.toLowerCase())
)
              .map((app) => (

                <tr key={app.id}>

                  <td>{app.userName}</td>

                  <td>{app.userEmail}</td>

                  <td>{app.jobTitle}</td>

                  <td>

                    <span
                      className={`status ${app.status.toLowerCase()}`}
                    >
                      {app.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* Recent Jobs */}
      <div className="recent-section">

        <div className="section-header">

          <h3>Your Recent Job Postings</h3>

          <Link
            to="/recruiter/manage-jobs"
            className="see-all"
          >
            Manage All →
          </Link>

        </div>

        {jobs.length === 0 ? (

          <div className="empty-state">

            <p>
              No jobs posted yet.
            </p>

            <Link
              to="/recruiter/post-job"
              className="btn-primary"
            >
              Post First Job
            </Link>

          </div>

        ) : (

          <div className="jobs-summary-list">

            {jobs.slice(0, 5).map((job) => (

              <div
                key={job.id}
                className="job-summary-row"
              >

                <div className="job-details">

                  <strong>{job.title}</strong>

                  <p>{job.companyName}</p>

                  <span
                    className={`status-badge ${
                      job.active
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {job.active ? "Active" : "Inactive"}
                  </span>

                </div>

                <div className="applicant-count">

                  <strong>
                    {applicantCounts[job.id] || 0}
                  </strong>

                  <span>Applicants</span>

                </div>

                <Link
                  to={`/recruiter/applicants/${job.id}`}
                  className="btn-outline small"
                >
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