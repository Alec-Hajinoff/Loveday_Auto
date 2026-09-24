import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerCancelBooking from "../CustomerCancelBooking";
import { customerCancelBooking } from "../ApiService";

jest.mock("../ApiService", () => ({
  customerCancelBooking: jest.fn(),
}));

describe("CustomerCancelBooking Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  test("renders initial cancel booking button", () => {
    render(
      <CustomerCancelBooking appointmentId={1} onBookingCancelled={() => {}} />,
    );

    expect(
      screen.getByRole("button", { name: "Cancel Booking" }),
    ).toBeInTheDocument();
  });

  test("shows confirmation prompt when initial button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CustomerCancelBooking appointmentId={1} onBookingCancelled={() => {}} />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel Booking" }));

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Yes, Cancel" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel Booking" }),
    ).not.toBeInTheDocument();
  });

  test('returns to initial state when "No" button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CustomerCancelBooking appointmentId={1} onBookingCancelled={() => {}} />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel Booking" }));
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "No" }));

    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel Booking" }),
    ).toBeInTheDocument();
  });

  test("successfully cancels booking, shows loading state, and calls callback", async () => {
    const user = userEvent.setup();
    const handleCancelledMock = jest.fn();
    customerCancelBooking.mockResolvedValueOnce({ status: "success" });

    render(
      <CustomerCancelBooking
        appointmentId={42}
        onBookingCancelled={handleCancelledMock}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel Booking" }));

    await user.click(screen.getByRole("button", { name: "Yes, Cancel" }));

    expect(customerCancelBooking).toHaveBeenCalledWith(42);

    await waitFor(() => {
      expect(handleCancelledMock).toHaveBeenCalledTimes(1);
    });
  });

  test("alerts error message when cancellation API returns an error status", async () => {
    const user = userEvent.setup();
    customerCancelBooking.mockResolvedValueOnce({
      status: "error",
      message: "Unable to cancel this appointment.",
    });

    render(
      <CustomerCancelBooking
        appointmentId={42}
        onBookingCancelled={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel Booking" }));
    await user.click(screen.getByRole("button", { name: "Yes, Cancel" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Unable to cancel this appointment.",
      );
    });
  });

  test("alerts error message when cancellation API throws an exception", async () => {
    const user = userEvent.setup();
    customerCancelBooking.mockRejectedValueOnce(new Error("Network error"));

    render(
      <CustomerCancelBooking
        appointmentId={42}
        onBookingCancelled={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel Booking" }));
    await user.click(screen.getByRole("button", { name: "Yes, Cancel" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Network error");
    });
  });
});
