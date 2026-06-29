import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { applicationsAPI } from "../api/api";
import toast from "react-hot-toast";
import "./Applicants.css";

const Applicants = () => {

    const { jobId } = useParams();

    const [loading, setLoading] = useState(true);

    const [applications, setApplications] = useState([]);

    useEffect(() => {

        loadApplicants();

    }, []);

    const loadApplicants = async () => {

        try {

            const res = await applicationsAPI.getJobApplicants(jobId);

            setApplications(res.data);

        }

        catch {

            toast.error("Unable to load applicants");

        }

        finally {

            setLoading(false);

        }

    };

    const updateStatus = async (id, status) => {

        try {

            await applicationsAPI.updateStatus(id, status);

            toast.success("Status Updated");

            loadApplicants();

        }

        catch {

            toast.error("Unable to update");

        }

    };

    if (loading)
        return <h2 className="loading">Loading Applicants...</h2>;

    return (

        <div className="applicants-page">

            <h1>Applicants</h1>

            {applications.length === 0 ? (

                <div className="empty">

                    No applicants yet.

                </div>

            ) : (

                <table className="applicants-table">

                    <thead>

                        <tr>

                            <th>Name</th>
                            <th>Email</th>
                            <th>Resume</th>
                            <th>Applied On</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {applications.map((app) => (

                            <tr key={app.id}>

                                <td>{app.applicantName}</td>

                                <td>{app.applicantEmail}</td>

                                <td>

                                    <a
                                        href={app.resumeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="resume-btn"
                                    >

                                        View Resume

                                    </a>

                                </td>

                                <td>

                                    {new Date(app.appliedAt).toLocaleDateString()}

                                </td>

                                <td>

                                    <select

                                        value={app.status}

                                        onChange={(e) =>
                                            updateStatus(app.id, e.target.value)
                                        }

                                    >

                                        <option>Pending</option>

                                        <option>Shortlisted</option>

                                        <option>Rejected</option>

                                    </select>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>

    );

};

export default Applicants;