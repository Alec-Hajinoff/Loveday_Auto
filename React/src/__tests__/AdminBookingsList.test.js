import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminBookingsList from "../AdminBookingsList";
import { adminBookingsList } from "../ApiService";

jest.mock("../ApiService", () => ({
  adminBookingsList: jest.fn(),
}));

jest.mock("../AdminCancelBooking", () => () => (
  <div data-testid="admin-cancel-booking">Mocked Cancel Booking</div>
));

const mockBookingsResponse = {
  status: "success",
  upcoming: [
    {
      appointment_id: 1,
      date: "2026-09-24",
      start_time: "09:00:00",
      end_time: "10:00:00",
      first_name: "John",
      surname: "Doe",
      customer_phone: "07123456789",
      customer_email: "john@example.com",
      service_name: "Full Service",
      vehicle_reg: "AB12 CDE",
      notes: "Check brakes please",
    },
  ],
};

describe("AdminBookingsList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially and displays upcoming bookings upon success", async () => {
    adminBookingsList.mockResolvedValueOnce(mockBookingsResponse);

    render(<AdminBookingsList />);

    expect(screen.getByText(/Loading garage bookings.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Upcoming Appointments/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Service/i)).toBeInTheDocument();
    expect(screen.getByText(/AB12 CDE/i)).toBeInTheDocument();
    expect(screen.getByText(/Check brakes please/i)).toBeInTheDocument();
    expect(screen.getByTestId("admin-cancel-booking")).toBeInTheDocument();
  });

  test("handles API error responses gracefully", async () => {
    adminBookingsList.mockResolvedValueOnce({
      status: "error",
      message: "Failed to retrieve bookings",
    });

    render(<AdminBookingsList />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to retrieve bookings/i),
      ).toBeInTheDocument();
    });
  });

  test("displays empty state message when there are no upcoming appointments", async () => {
    adminBookingsList.mockResolvedValueOnce({
      status: "success",
      upcoming: [],
    });

    render(<AdminBookingsList />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /No upcoming appointments scheduled from today onwards./i,
        ),
      ).toBeInTheDocument();
    });
  });
});
