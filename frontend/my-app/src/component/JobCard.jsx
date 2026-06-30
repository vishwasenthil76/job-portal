import React from "react";
import "./JobCard.css";

const JobCard = ({ job, onClick }) => {
  return (
    <div className="job-card" onClick={onClick}>

      <div className="job-card-header">
        <div className="company-logo">
          {job.companyName?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3>{job.title}</h3>
          <p className="company-name">{job.companyName}</p>
        </div>
      </div>

      <div className="job-info">
        <span>📍 {job.location}</span>

        <span>💼 {job.experienceLevel}</span>

        <span>🕒 {job.jobType}</span>
      </div>

      <div className="salary">
        💰 {job.salaryRange || "Not Disclosed"}
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="skills">
          {job.skills.map((skill, index) => (
            <span key={index} className="skill">
              {skill}
            </span>
          ))}
        </div>
      )}

      <button className="apply-btn">
        View Details →
      </button>

    </div>
  );
};

export default JobCard;