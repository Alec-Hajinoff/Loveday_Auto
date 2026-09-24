import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingCalendar from "../BookingCalendar";
import { bookingCalendar, selectedAppointmentSlot } from "../ApiService";

jest.mock("../ApiService", () => ({
  bookingCalendar: jest.fn(),
  selectedAppointmentSlot: jest.fn(),
}));

jest.mock("../BookingDetailsForm", () => ({ onConfirm, submitting }) => (
  <div data-testid="booking-details-form">
    <button
      type="button"
      onClick={() =>
        onConfirm({ customer_name: "John Doe", email: "john@example.com" })
      }
      disabled={submitting}
    >
      {submitting ? "Submitting Booking..." : "Confirm Booking"}
    </button>
  </div>
));

describe("BookingCalendar Component", () => {
  const mockSlotsResponse = {
    status: "success",
    slots: [
      {
        id: 1,
        date: "2026-09-24",
        start_time: "10:00",
        end_time: "11:00",
        status: "available",
      },
      {
        id: 2,
        date: "2026-09-24",
        start_time: "11:00",
        end_time: "12:00",
        status: "booked",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    Element.prototype.scrollIntoView = jest.fn();
  });

  test("renders calendar header and loads appointment slots on mount", async () => {
    bookingCalendar.mockResolvedValueOnce(mockSlotsResponse);

    render(<BookingCalendar />);

    expect(screen.getByText("Available Appointments")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "10:00 - 11:00" }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Booked")).toBeInTheDocument();
    expect(bookingCalendar).toHaveBeenCalledTimes(1);
  });

  test("selects an available slot and displays booking details form", async () => {
    const user = userEvent.setup();
    bookingCalendar.mockResolvedValueOnce(mockSlotsResponse);

    render(<BookingCalendar />);

    const slotButton = await screen.findByRole("button", {
      name: "10:00 - 11:00",
    });
    await user.click(slotButton);

    expect(screen.getByTestId("booking-details-form")).toBeInTheDocument();
  });

  test("successfully confirms booking, reloads calendar, and shows success message", async () => {
    const user = userEvent.setup();
    bookingCalendar.mockResolvedValue(mockSlotsResponse);
    selectedAppointmentSlot.mockResolvedValueOnce({ status: "success" });

    render(<BookingCalendar />);

    const slotButton = await screen.findByRole("button", {
      name: "10:00 - 11:00",
    });
    await user.click(slotButton);

    const confirmButton = screen.getByRole("button", {
      name: "Confirm Booking",
    });
    await user.click(confirmButton);

    expect(selectedAppointmentSlot).toHaveBeenCalledWith({
      customer_name: "John Doe",
      email: "john@example.com",
      slot_ids: [1],
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Thank you, we've got your booking/i),
      ).toBeInTheDocument();
    });
  });

  test("handles API load failure gracefully", async () => {
    bookingCalendar.mockResolvedValueOnce({
      status: "error",
      message: "Failed to load schedule.",
    });

    render(<BookingCalendar />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load schedule.")).toBeInTheDocument();
    });
  });
});
