import React, { useState } from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
import BookingCalendar from "./BookingCalendar";

import CustomerBookingsList from "./CustomerBookingsList";

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
              Welcome to your dashboard. Here you can track your appointments
              and book new slots.
            </p>
          </div>

          <hr />
          <CustomerBookingsList />

          <hr />
          <BookingCalendar />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
