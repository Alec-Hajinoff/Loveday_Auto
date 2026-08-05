import React, { useState, useEffect, useCallback } from "react";
import "./AdminBookingCalendar.css";
import { adminBookingCalendar } from "./ApiService";

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

function AdminBookingCalendar() {
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [slotsData, setSlotsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
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
      const response = await adminBookingCalendar(startDateStr, endDateStr);
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

  useEffect(() => {
    const handleBookingUpdate = () => {
      loadCalendarSlots();
    };

    window.addEventListener("bookingUpdated", handleBookingUpdate);
    return () => {
      window.removeEventListener("bookingUpdated", handleBookingUpdate);
    };
  }, [loadCalendarSlots]);

  const handlePrevWeek = () => {
    setSelectedSlots([]);
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentMonday(prev);
  };

  const handleNextWeek = () => {
    setSelectedSlots([]);
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentMonday(next);
  };

  const handleToday = () => {
    setSelectedSlots([]);
    setCurrentMonday(getMonday(new Date()));
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.id === slot.id);
      if (exists) {
        return prev.filter((s) => s.id !== slot.id);
      } else {
        return [...prev, slot];
      }
    });
  };

  const timeRows = Array.from(
    new Set(slotsData.map((s) => s.start_time)),
  ).sort();

  return (
    <div className="admin-booking-calendar-container">
      <div className="admin-calendar-header">
        <h4>Garage Schedule Overview</h4>
        <div className="admin-calendar-nav">
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
      {message && <div className="text-info mb-2">{message}</div>}

      {!loading && (
        <div className="table-responsive">
          <table className="table table-bordered admin-calendar-table">
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

                      const isSelected = selectedSlots.some(
                        (s) => s.id === slot.id,
                      );

                      return (
                        <td key={dateIso}>
                          {slot.status === "available" ? (
                            <button
                              type="button"
                              className={`btn admin-slot-btn ${
                                isSelected
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleSelectSlot(slot)}
                            >
                              {slot.start_time} - {slot.end_time}
                            </button>
                          ) : (
                            <span className="admin-slot-booked">Booked</span>
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
    </div>
  );
}

export default AdminBookingCalendar;
