import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobsAPI } from "../api/api";
import toast from "react-hot-toast";
import "./PostJob.css";

const EditJob = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [job, setJob] = useState({
        title: "",
        companyName: "",
        location: "",
        salaryRange: "",
        experienceLevel: "",
        jobType: "",
        skills: "",
        description: "",
        requirements: "",
        active: true
    });

    useEffect(() => {

        loadJob();

    }, []);

    const loadJob = async () => {

        try {

            const res = await jobsAPI.getById(id);

            setJob({

                ...res.data,

                skills: res.data.skills?.join(", ")

            });

        } catch {

            toast.error("Unable to load job");

        }

    };

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
                    .map(s => s.trim())
                    .filter(Boolean)

            };

            await jobsAPI.update(id, payload);

            toast.success("Job Updated Successfully");

            navigate("/recruiter/manage-jobs");

        } catch {

            toast.error("Update Failed");

        }

        setLoading(false);

    };

    return (

        <div className="post-job-page">

            <div className="post-job-card">

                <h1>Edit Job</h1>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>Job Title</label>

                            <input
                                name="title"
                                value={job.title}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Company</label>

                            <input
                                name="companyName"
                                value={job.companyName}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Location</label>

                            <input
                                name="location"
                                value={job.location}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Salary</label>

                            <input
                                name="salaryRange"
                                value={job.salaryRange}
                                onChange={handleChange}
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

                            <label>Job Type</label>

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

                        <label>Skills</label>

                        <input
                            name="skills"
                            value={job.skills}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            rows="5"
                            name="description"
                            value={job.description}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Requirements</label>

                        <textarea
                            rows="4"
                            name="requirements"
                            value={job.requirements}
                            onChange={handleChange}
                        />

                    </div>

                    <button className="publish-btn">

                        {loading ? "Updating..." : "Update Job"}

                    </button>

                </form>

            </div>

        </div>

    );

};

export default EditJob;