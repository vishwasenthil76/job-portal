import React from "react";
import "./DashboardCard.css";

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  color
}) => {
  return (
    <div className={`dashboard-card ${color}`}>

      <div className="card-top">

        <div>

          <p className="card-title">
            {title}
          </p>

          <h2 className="card-value">
            {value}
          </h2>

          <span className="card-subtitle">
            {subtitle}
          </span>

        </div>

        <div className="card-icon">
          {icon}
        </div>

      </div>

    </div>
  );
};

export default DashboardCard;