import React from "react";
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiPlusCircle,
  FiBell,
  FiSettings,
  FiBuilding
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    {
      title: "Dashboard",
      icon: <FiHome />,
      link: "/recruiter/dashboard"
    },
    {
      title: "Post Job",
      icon: <FiPlusCircle />,
      link: "/recruiter/post-job"
    },
    {
      title: "Manage Jobs",
      icon: <FiBriefcase />,
      link: "/recruiter/manage-jobs"
    },
    {
      title: "Applicants",
      icon: <FiUsers />,
      link: "/recruiter/applicants"
    },
    {
      title: "Company Profile",
      icon: <FiBuilding />,
      link: "/recruiter/company"
    },
    {
      title: "Notifications",
      icon: <FiBell />,
      link: "/recruiter/notifications"
    },
    {
      title: "Settings",
      icon: <FiSettings />,
      link: "/recruiter/settings"
    }
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        <span className="logo-icon">💼</span>
        <h2>JobConnect</h2>
      </div>

      <nav>

        {menu.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className={
              location.pathname === item.link
                ? "menu-item active"
                : "menu-item"
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}

      </nav>

      <div className="support-card">

        <h3>Need Help?</h3>

        <p>
          We're here to help you find the best talent.
        </p>

        <button>Contact Support</button>

      </div>

    </aside>
  );
};

export default Sidebar;