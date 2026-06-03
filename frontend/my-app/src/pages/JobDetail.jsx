import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const { user, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    jobsAPI.getById(id)
      .then((res) => setJob(res.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      const formData = new FormData();
      if (resume) formData.append('resume', resume);
      formData.append('coverLetter', coverLetter);
      await applicationsAPI.apply(id, formData);
      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-loading">Loading job details...</div>;
  if (!job) return <div className="not-found">Job not found</div>;

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        {/* Header */}
        <div className="job-detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <div className="job-title-section">
            <h1>{job.title}</h1>
            <h2>{job.companyName}</h2>
            <div className="job-meta">
              <span className="tag">📍 {job.location}</span>
              {job.salaryRange && <span className="tag">💰 {job.salaryRange}</span>}
              {job.jobType && <span className="tag">⏱ {job.jobType}</span>}
              {job.experienceLevel && <span className="tag">📊 {job.experienceLevel}</span>}
            </div>
          </div>

          {isJobSeeker() && (
            <button
              onClick={() => setShowApplyForm(true)}
              className="btn-primary apply-btn"
            >
              Apply Now
            </button>
          )}
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="section">
            <h3>Required Skills</h3>
            <div className="skills-list">
              {job.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="section">
          <h3>Job Description</h3>
          <p className="job-description">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="section">
            <h3>Requirements</h3>
            <p className="job-description">{job.requirements}</p>
          </div>
        )}

        {/* Posted by */}
        <div className="job-footer">
          <p>Posted by {job.createdByName} · {new Date(job.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyForm && (
        <div className="modal-overlay" onClick={() => setShowApplyForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button onClick={() => setShowApplyForm(false)}>✕</button>
            </div>
            <form onSubmit={handleApply} className="apply-form">
              <div className="form-group">
                <label>Resume (PDF, optional if profile has one)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell them why you're a great fit..."
                  rows={5}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowApplyForm(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;