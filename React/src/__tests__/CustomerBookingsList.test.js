import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerBookingsList from "../CustomerBookingsList";
import { customerBookingsList } from "../ApiService";

jest.mock("../ApiService", () => ({
  customerBookingsList: jest.fn(),
}));

jest.mock("../CustomerCancelBooking", () => ({ onBookingCancelled }) => (
  <button data-testid="cancel-booking-btn" onClick={onBookingCancelled}>
    Cancel Booking
  </button>
));

describe("CustomerBookingsList Component", () => {
  const mockBookingsResponse = {
    status: "success",
    upcoming: [
      {
        appointment_id: 1,
        date: "2026-09-30",
        start_time: "10:00:00",
        end_time: "11:00:00",
        service_name: "MOT Test",
        vehicle_reg: "AB12CDE",
        notes: "Check brakes",
      },
    ],
    past: [
      {
        appointment_id: 2,
        date: "2026-08-15",
        start_time: "14:00:00",
        end_time: "15:00:00",
        service_name: "Full Service",
        vehicle_reg: "XY54ZAB",
        notes: null,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays loading state initially and renders upcoming and past bookings on success", async () => {
    customerBookingsList.mockResolvedValueOnce(mockBookingsResponse);

    render(<CustomerBookingsList />);

    expect(screen.getByText("Loading your bookings...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Your Upcoming Appointments"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("30-09-2026 (10:00 - 11:00)")).toBeInTheDocument();
    expect(screen.getByText("MOT Test")).toBeInTheDocument();
    expect(screen.getByText("AB12CDE")).toBeInTheDocument();
    expect(screen.getByText("Check brakes")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();

    expect(screen.getByText("Your Previous Appointments")).toBeInTheDocument();
    expect(screen.getByText("15-08-2026 (14:00 - 15:00)")).toBeInTheDocument();
    expect(screen.getByText("Full Service")).toBeInTheDocument();
    expect(screen.getByText("XY54ZAB")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
  });

  test("displays error message when API fails", async () => {
    customerBookingsList.mockResolvedValueOnce({
      status: "error",
      message: "Failed to retrieve bookings.",
    });

    render(<CustomerBookingsList />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to retrieve bookings."),
      ).toBeInTheDocument();
    });
  });

  test("displays empty state messages when no bookings exist", async () => {
    customerBookingsList.mockResolvedValueOnce({
      status: "success",
      upcoming: [],
      past: [],
    });

    render(<CustomerBookingsList />);

    await waitFor(() => {
      expect(
        screen.getByText("No upcoming appointments scheduled."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("No previous appointments found."),
      ).toBeInTheDocument();
    });
  });

  test("handles booking cancellation, refetches bookings, and dispatches event", async () => {
    const user = userEvent.setup();
    customerBookingsList.mockResolvedValue(mockBookingsResponse);
    const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");

    render(<CustomerBookingsList />);

    await waitFor(() => {
      expect(screen.getByTestId("cancel-booking-btn")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("cancel-booking-btn"));

    expect(customerBookingsList).toHaveBeenCalledTimes(3);

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "bookingUpdated" }),
    );

    dispatchEventSpy.mockRestore();
  });

  test("paginates past appointments correctly", async () => {
    const manyPastBookings = {
      status: "success",
      upcoming: [],
      past: Array.from({ length: 7 }, (_, index) => ({
        appointment_id: 10 + index,
        date: `2026-07-0${index + 1}`,
        start_time: "09:00:00",
        end_time: "10:00:00",
        service_name: `Service ${index + 1}`,
        vehicle_reg: `REG${index}`,
        notes: null,
      })),
    };

    customerBookingsList.mockResolvedValueOnce(manyPastBookings);
    const user = userEvent.setup();

    render(<CustomerBookingsList />);

    await waitFor(() => {
      expect(screen.getByText("Service 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Service 5")).toBeInTheDocument();
    expect(screen.queryByText("Service 6")).not.toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /Next >/i });
    await user.click(nextButton);

    expect(screen.getByText("Service 6")).toBeInTheDocument();
    expect(screen.queryByText("Service 1")).not.toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /< Prev/i });
    await user.click(prevButton);

    expect(screen.getByText("Service 1")).toBeInTheDocument();
  });
});
