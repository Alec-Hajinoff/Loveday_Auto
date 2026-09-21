import React, { useState, useEffect, useCallback } from "react";
import "./AdminBookingsList.css";
import { adminBookingsList } from "./ApiService";

import AdminCancelBooking from "./AdminCancelBooking";

function AdminBookingsList() {
  const [upcoming, setUpcoming] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const response = await adminBookingsList();
      if (response.status === "success") {
        setUpcoming(response.upcoming);
      } else {
        setError(response.message || "Could not load bookings.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();

    const handleBookingUpdate = () => {
      fetchBookings();
    };

    window.addEventListener("bookingUpdated", handleBookingUpdate);
    return () => {
      window.removeEventListener("bookingUpdated", handleBookingUpdate);
    };
  }, [fetchBookings]);

  const handleBookingCancelled = () => {
    fetchBookings();
    window.dispatchEvent(new CustomEvent("bookingUpdated"));
  };

  const formatUKDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  if (loading) {
    return <div className="text-muted my-3">Loading garage bookings...</div>;
  }

  if (error) {
    return <div className="alert alert-danger my-3">{error}</div>;
  }

  const renderBookingCard = (booking) => (
    <div key={booking.appointment_id} className="booking-card">
      <div className="booking-card-header">
        <span className="booking-date">
          {formatUKDate(booking.date)} ({booking.start_time.slice(0, 5)} -{" "}
          {booking.end_time.slice(0, 5)})
        </span>
        <span className="badge-upcoming">Upcoming</span>
      </div>

      <div className="booking-card-body">
        <div className="booking-detail-item">
          <strong>Customer:</strong> {booking.first_name} {booking.surname}{" "}
          {booking.customer_phone ? `(${booking.customer_phone})` : ""}{" "}
          {booking.customer_email ? `<${booking.customer_email}>` : ""}
        </div>

        {booking.service_name && (
          <div className="booking-detail-item">
            <strong>Service:</strong> {booking.service_name}
          </div>
        )}

        {booking.vehicle_reg && (
          <div className="booking-detail-item">
            <strong>Vehicle Reg:</strong> {booking.vehicle_reg}
          </div>
        )}

        {booking.notes && (
          <div className="booking-detail-item">
            <strong>Notes:</strong> {booking.notes}
          </div>
        )}

        <AdminCancelBooking
          appointment_id={booking.appointment_id}
          onBookingCancelled={handleBookingCancelled}
        />
      </div>
    </div>
  );

  return (
    <div className="admin-bookings-container">
      <div className="bookings-section mb-0">
        <h6 className="text-primary mb-3">Upcoming Appointments</h6>
        {upcoming.length === 0 ? (
          <p className="text-muted small">
            No upcoming appointments scheduled.
          </p>
        ) : (
          upcoming.map((b) => renderBookingCard(b))
        )}
      </div>
    </div>
  );
}

export default AdminBookingsList;
