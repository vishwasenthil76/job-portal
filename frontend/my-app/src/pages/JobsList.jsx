import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../api/api';
import toast from 'react-hot-toast';
import JobCard from "../component/JobCard";
import "./JobsList.css";
import "../component/JobCard.css";


const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: '', location: '', experience: '', jobType: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchJobs = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const params = { page, size: 9, ...appliedFilters };
      // Remove empty params
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await jobsAPI.search(params);
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    fetchJobs(0);
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    setFilters({ keyword: '', location: '', experience: '', jobType: '' });
    setAppliedFilters({});
  };

  return (
    <div className="jobs-page">
      {/* Search bar */}
      <div className="search-section">
        <div className="search-container">
          <h1>Find Your Dream Job Today</h1>



<p>
  Discover thousands of opportunities from top companies
  across India and Remote locations.
</p>
          <p>{totalElements} jobs available</p>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Job title, skills, or company..."
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="search-input"
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>

          <div className="filter-row">
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>

            <select
              value={filters.experience}
              onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            >
              <option value="">All Experience</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
            </select>

            <select
              value={filters.jobType}
              onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <button type="button" onClick={clearFilters} className="btn-outline">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Job grid */}
      <div className="jobs-container">
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <p>🔍 No jobs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => navigate(`/jobs/${job.id}`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => fetchJobs(currentPage - 1)}
              disabled={currentPage === 0}
              className="btn-outline"
            >
              ← Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchJobs(i)}
                className={`page-btn ${i === currentPage ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => fetchJobs(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="btn-outline"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;