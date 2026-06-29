import { Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobsList from "./pages/JobsList";
import JobDetail from "./pages/JobDetail";
import SeekerDashboard from "./pages/SeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import ManageJobs from "./pages/ManageJobs";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";
import MyApplications from "./pages/MyApplications.jsx";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<JobsList />} />
        <Route path="/jobs" element={<JobsList />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/jobs/:id" element={<JobDetail />} />

        <Route path="/dashboard" element={<SeekerDashboard />} />
        <Route path="/applications" element={<MyApplications />} />

        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/post-job" element={<PostJob />} />
        <Route path="/recruiter/manage-jobs" element={<ManageJobs />} />
        <Route path="/recruiter/edit-job/:id" element={<EditJob />} />
        <Route path="/recruiter/applicants/:jobId" element={<Applicants />} />
      </Routes>
    </>
  );
}

export default App;