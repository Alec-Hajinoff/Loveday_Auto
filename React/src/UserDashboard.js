import React, { useState } from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
/* MODIFICATION: Imported BookingCalendar component */
import BookingCalendar from "./BookingCalendar";

function UserDashboard() {
  const [refreshProjects, setRefreshProjects] = useState(0);

  const handleProjectSubmitted = () => {
    setRefreshProjects((prev) => prev + 1);
  };

  return (
    <div className="user-dashboard-container container">
      {" "}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="admin-header">
            <p>
              Welcome to your dashboard. Here you can submit new projects, track
              progress, and manage your existing work.
            </p>
          </div>
          {/* MODIFICATION: Rendered BookingCalendar inside UserDashboard for logged-in customers */}
          <hr />
          <BookingCalendar />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
