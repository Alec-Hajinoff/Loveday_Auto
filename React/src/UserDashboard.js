import React from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
import BookingCalendar from "./BookingCalendar";
import CustomerBookingsList from "./CustomerBookingsList";
import CustomerProfile from "./CustomerProfile";
import CustomerDeleteAccount from "./CustomerDeleteAccount";

function UserDashboard() {
  return (
    <div className="user-dashboard-container container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="admin-header">
            <p>
              Welcome to your dashboard. Here you can track your appointments
              and book new slots.
            </p>
          </div>

          <CustomerProfile />

          <hr />
          <CustomerBookingsList />

          <hr />
          <BookingCalendar />

          <hr />

          <CustomerDeleteAccount />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
