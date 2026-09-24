import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminCancelBooking from "../AdminCancelBooking";
import { adminCancelBooking } from "../ApiService";

jest.mock("../ApiService", () => ({
  adminCancelBooking: jest.fn(),
}));

describe("AdminCancelBooking Component", () => {
  const mockAppointmentId = 123;
  const mockOnBookingCancelled = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  test("renders initial cancel button and reveals confirmation options when clicked", async () => {
    const user = userEvent.setup();
    render(<AdminCancelBooking appointment_id={mockAppointmentId} />);

    const initialButton = screen.getByRole("button", {
      name: /Cancel Booking/i,
    });
    expect(initialButton).toBeInTheDocument();

    await user.click(initialButton);

    expect(screen.getByText(/Cancel this booking\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Yes, Cancel/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /No/i })).toBeInTheDocument();
  });

  test('returns to initial state when "No" button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminCancelBooking appointment_id={mockAppointmentId} />);

    await user.click(screen.getByRole("button", { name: /Cancel Booking/i }));
    expect(screen.getByText(/Cancel this booking\?/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /No/i }));

    expect(
      screen.getByRole("button", { name: /Cancel Booking/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Cancel this booking\?/i),
    ).not.toBeInTheDocument();
  });

  test("successfully handles cancellation flow on confirmation", async () => {
    adminCancelBooking.mockResolvedValueOnce({ status: "success" });
    const user = userEvent.setup();

    const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");

    render(
      <AdminCancelBooking
        appointment_id={mockAppointmentId}
        onBookingCancelled={mockOnBookingCancelled}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Cancel Booking/i }));
    await user.click(screen.getByRole("button", { name: /Yes, Cancel/i }));

    expect(adminCancelBooking).toHaveBeenCalledWith(mockAppointmentId);

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalled();
      expect(mockOnBookingCancelled).toHaveBeenCalledTimes(1);
    });
  });

  test("shows an alert when cancellation fails from API error response", async () => {
    adminCancelBooking.mockResolvedValueOnce({
      status: "error",
      message: "Booking cannot be found",
    });
    const user = userEvent.setup();

    render(<AdminCancelBooking appointment_id={mockAppointmentId} />);

    await user.click(screen.getByRole("button", { name: /Cancel Booking/i }));
    await user.click(screen.getByRole("button", { name: /Yes, Cancel/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Booking cannot be found");
    });
  });
});
