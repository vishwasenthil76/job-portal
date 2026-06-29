import React, { useEffect, useState } from "react";
import { jobsAPI } from "../api/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./ManageJobs.css";

const ManageJobs = () => {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try{
            const res = await jobsAPI.getMyJobs();
            setJobs(res.data);
        }
        catch{
            toast.error("Failed to load jobs");
        }
        finally{
            setLoading(false);
        }
    }

    const deleteJob = async(id)=>{
        if(!window.confirm("Delete this job?")) return;

        try{
            await jobsAPI.delete(id);
            toast.success("Job deleted");
            loadJobs();
        }
        catch{
            toast.error("Delete failed");
        }
    }

    return (

<div className="manage-page">

<div className="manage-header">

<div>
<h1>Manage Jobs</h1>
<p>Monitor and manage all your job postings.</p>
</div>

<Link to="/recruiter/post-job" className="new-job-btn">
+ Post New Job
</Link>

</div>

{loading ?

<div className="loading">
Loading...
</div>

:

jobs.length===0 ?

<div className="empty-card">

<h2>No Jobs Posted</h2>

<p>Create your first job posting.</p>

<Link to="/recruiter/post-job" className="new-job-btn">
Create Job
</Link>

</div>

:

<table className="jobs-table">

<thead>

<tr>

<th>Job</th>

<th>Company</th>

<th>Location</th>

<th>Status</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{

jobs.map(job=>(

<tr key={job.id}>

<td>

<div className="job-title">

<strong>{job.title}</strong>

<small>{job.jobType}</small>

</div>

</td>

<td>{job.companyName}</td>

<td>{job.location}</td>

<td>

<span className={job.active?"status active":"status inactive"}>

{job.active?"Active":"Inactive"}

</span>

</td>

<td>

<div className="action-buttons">

<Link
to={`/recruiter/edit-job/${job.id}`}
className="edit-btn">

Edit

</Link>

<Link
to={`/recruiter/applicants/${job.id}`}
className="view-btn">

Applicants

</Link>

<button
className="delete-btn"
onClick={()=>deleteJob(job.id)}>

Delete

</button>

</div>

</td>

</tr>

))

}

</tbody>

</table>

}

</div>

    );

}

export default ManageJobs;