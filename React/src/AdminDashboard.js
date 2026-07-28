import React, { useState } from "react";
import "./AdminDashboard.css";
import LogoutComponent from "./LogoutComponent";

import AdminPanel from "./AdminPanel";

function AdminDashboard() {
  const [refreshProjects, setRefreshProjects] = useState(0);

  const handleProjectSubmitted = () => {
    setRefreshProjects((prev) => prev + 1);
  };

  return (
    <div className="admin-container container">
      {" "}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="admin-header">
            <p>
              Welcome to your admin dashboard. Here you can manage users,
              projects and system settings.
            </p>
          </div>

          <AdminPanel />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
