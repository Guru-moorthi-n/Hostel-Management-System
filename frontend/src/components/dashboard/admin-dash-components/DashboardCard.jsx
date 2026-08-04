import React from "react";

function DashboardCard({ title, value, info, iconClass }) {
  return (
    <div className="dashboard-card">
      <div className="card-top">
        <div className="card-icon">
          <i className={iconClass}></i>
        </div>

        <p className="card-title">{title}</p>
      </div>

      <div className="card-bottom">
        <h2>{value}</h2>

        <span>{info}</span>
      </div>
    </div>
  );
}

export default DashboardCard;
