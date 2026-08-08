import React, { useState } from "react";
import "./AdminDashboard.css";
import LogoutComponent from "./LogoutComponent";
import BusinessHoursManager from "./BusinessHoursManager";
import ServiceManager from "./ServiceManager";

import AdminBookingsList from "./AdminBookingsList";
import AdminBookingCalendar from "./AdminBookingCalendar";
import AvailabilityHorizonExtender from "./AvailabilityHorizonExtender";
import AdminProductEntry from "./AdminProductEntry";

function AdminDashboard() {
  const [refreshProducts, setRefreshProducts] = useState(0);

  const handleProductAdded = () => {
    setRefreshProducts((prev) => prev + 1);
  };

  return (
    <div className="admin-container container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="admin-header">
            <p>
              Welcome to your admin dashboard. Here you can manage bookings,
              business hours, services, and inventory.
            </p>
          </div>

          <AdminBookingsList />

          <AdminBookingCalendar />

          <hr />

          <div className="row">
            <div className="col-12 col-md-6 mb-4">
              <BusinessHoursManager />
            </div>
            <div className="col-12 col-md-6 mb-4">
              <ServiceManager />
            </div>
          </div>

          <AvailabilityHorizonExtender />

          <hr />

          <AdminProductEntry onProductAdded={handleProductAdded} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
