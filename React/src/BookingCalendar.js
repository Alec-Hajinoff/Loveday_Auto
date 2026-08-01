import React, { useState, useEffect, useCallback } from "react";
import "./BookingCalendar.css";
import { bookingCalendar } from "./ApiService";

const formatISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatUKDate = (date) => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

function BookingCalendar() {
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [slotsData, setSlotsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentMonday);
    day.setDate(day.getDate() + i);
    return day;
  });

  const startDateStr = formatISO(weekDays[0]);
  const endDateStr = formatISO(weekDays[6]);

  const loadCalendarSlots = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await bookingCalendar(startDateStr, endDateStr);
      if (response.status === "success") {
        setSlotsData(response.slots);
      } else {
        setMessage(response.message || "Failed to load slots.");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [startDateStr, endDateStr]);

  useEffect(() => {
    loadCalendarSlots();
  }, [loadCalendarSlots]);

  const handlePrevWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentMonday(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentMonday(next);
  };

  const handleToday = () => {
    setCurrentMonday(getMonday(new Date()));
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const timeRows = Array.from(
    new Set(slotsData.map((s) => s.start_time)),
  ).sort();

  return (
    <div className="booking-calendar-container">
      <div className="calendar-header">
        <h4>Available Appointments</h4>
        <div className="calendar-nav">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handlePrevWeek}
          >
            &lt; Prev
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleToday}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleNextWeek}
          >
            Next &gt;
          </button>
        </div>
      </div>

      <p className="fw-bold">
        Week of {formatUKDate(weekDays[0])} - {formatUKDate(weekDays[6])}
      </p>

      {loading && <div>Loading schedule...</div>}
      {message && <div className="text-danger mb-2">{message}</div>}

      {!loading && (
        <div className="table-responsive">
          <table className="table table-bordered calendar-table">
            <thead>
              <tr>
                {weekDays.map((day) => (
                  <th key={day.toISOString()}>
                    <div>
                      {day.toLocaleDateString("en-GB", { weekday: "short" })}
                    </div>
                    <small className="text-muted">{formatUKDate(day)}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-muted">
                    No available hours scheduled for this week.
                  </td>
                </tr>
              ) : (
                timeRows.map((time) => (
                  <tr key={time}>
                    {weekDays.map((day) => {
                      const dateIso = formatISO(day);
                      const slot = slotsData.find(
                        (s) => s.date === dateIso && s.start_time === time,
                      );

                      if (!slot) {
                        return <td key={dateIso}>-</td>;
                      }

                      const isSelected =
                        selectedSlot && selectedSlot.id === slot.id;

                      return (
                        <td key={dateIso}>
                          {slot.is_available === 1 ? (
                            <button
                              type="button"
                              className={`btn slot-btn ${
                                isSelected
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleSelectSlot(slot)}
                            >
                              {slot.start_time} - {slot.end_time}
                            </button>
                          ) : (
                            <span className="slot-booked">Booked</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedSlot && (
        <div className="alert alert-info mt-3">
          Selected Slot: <strong>{selectedSlot.date}</strong> at{" "}
          <strong>
            {selectedSlot.start_time} - {selectedSlot.end_time}
          </strong>
        </div>
      )}
    </div>
  );
}

export default BookingCalendar;
