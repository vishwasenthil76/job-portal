import React, { useState } from "react";
import { jobsAPI } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./PostJob.css";

const PostJob = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

const [job, setJob] = useState({
  title: "",
  companyName: "",
  location: "",
  salaryRange: "",
  experienceLevel: "",
  jobType: "Full-time",
  skills: "",
  description: "",
  requirements: "",
  active: true
});

    const handleChange = (e) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const payload = {
    ...job,
    skills: job.skills
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
};

await jobsAPI.create(payload);

            toast.success("Job posted successfully 🎉");

            navigate("/recruiter/manage-jobs");

        } catch (err) {

            console.log(err);

            toast.error("Unable to post job");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="post-job-page">

            <div className="post-job-card">

                <h1>Post a New Job</h1>

                <p>Find the perfect candidate for your company.</p>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={job.title}
                                onChange={handleChange}
                                placeholder="Software Engineer"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={job.companyName}
                                onChange={handleChange}
                                placeholder="Google"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={job.location}
                                onChange={handleChange}
                                placeholder="Chennai"
                            />
                        </div>

                        <div className="form-group">
                            <label>Salary</label>
                            <input
                                type="text"
                                name="salaryRange"
                                value={job.salaryRange}
                                onChange={handleChange}
                                placeholder="8 LPA"
                            />
                        </div>

                        <div className="form-group">
                            <label>Experience</label>

                            <select
                                name="experienceLevel"
                                value={job.experienceLevel}
                                onChange={handleChange}
                            >

                                <option value="Entry">Entry</option>
                                <option value="Mid">Mid</option>
                                <option value="Senior">Senior</option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>Employment Type</label>

                            <select
                                name="jobType"
                                value={job.jobType}
                                onChange={handleChange}
                            >

                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Remote">Remote</option>

                            </select>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Skills Required</label>

                        <input
                            type="text"
                            name="skills"
                            value={job.skills}
                            onChange={handleChange}
                            placeholder="Java, Spring Boot, React"
                        />

                    </div>

                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            rows="6"
                            name="description"
                            value={job.description}
                            onChange={handleChange}
                            placeholder="Describe the job..."
                        ></textarea>

                    </div>

                    <div className="form-group">

                        <label>Qualification</label>

                        <textarea
                            rows="3"
                            name="requirements"
                            value={job.requirements}
                            onChange={handleChange}
                            placeholder="B.E/B.Tech"
                        ></textarea>

                    </div>

                    <button
                        className="publish-btn"
                        disabled={loading}
                    >

                        {loading ? "Publishing..." : "Publish Job"}

                    </button>

                </form>

            </div>

        </div>

    );

};

export default PostJob;