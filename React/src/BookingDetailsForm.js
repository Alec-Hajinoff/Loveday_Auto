import React, { useState, useEffect } from "react";
import "./BookingDetailsForm.css";
import { bookingDetailsForm } from "./ApiService";

function BookingDetailsForm({ onConfirm, submitting }) {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [vehicleReg, setVehicleReg] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await bookingDetailsForm();
        if (response.status === "success") {
          setServices(response.services);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!vehicleReg.trim()) {
      setErrorMessage("Vehicle registration number is required.");
      return;
    }

    if (!serviceId && !notes.trim()) {
      setErrorMessage(
        "Please either select a garage service or provide details in the notes section.",
      );
      return;
    }

    onConfirm({
      service_id: serviceId ? parseInt(serviceId, 10) : null,
      vehicle_reg: vehicleReg.trim(),
      notes: notes.trim() || null,
    });
  };

  return (
    <form className="booking-details-form" onSubmit={handleSubmit}>
      <h5 className="mb-3">Appointment Details</h5>

      {errorMessage && (
        <div className="alert alert-danger py-2">{errorMessage}</div>
      )}

      <div className="booking-form-group">
        <label className="form-label fw-bold">
          Vehicle Registration <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. AB12 CDE"
          value={vehicleReg}
          onChange={(e) => setVehicleReg(e.target.value)}
          required
        />
      </div>

      <div className="booking-form-group">
        <label className="form-label fw-bold">Select Service</label>
        <select
          className="form-select"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
        >
          <option value="">
            -- Choose a Service (Optional if notes provided) --
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}{" "}
              {service.price
                ? `(£${parseFloat(service.price).toFixed(2)})`
                : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="booking-form-group">
        <label className="form-label fw-bold">
          Notes / Additional Requirements
        </label>
        <textarea
          className="form-control"
          rows="2"
          placeholder="Describe your issue or custom request..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-sm mt-2"
        disabled={submitting}
      >
        {submitting ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}

export default BookingDetailsForm;
