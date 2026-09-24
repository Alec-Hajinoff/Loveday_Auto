import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminBookingCalendar from "../AdminBookingCalendar";
import { adminBookingCalendar } from "../ApiService";

jest.mock("../ApiService", () => ({
  adminBookingCalendar: jest.fn(),
}));

jest.mock("../BlockUnblockActionBar", () => () => (
  <div data-testid="block-unblock-action-bar">Mocked Action Bar</div>
));

const mockSlotsResponse = {
  status: "success",
  slots: [
    {
      id: 1,
      date: "2026-09-24",
      start_time: "09:00",
      end_time: "10:00",
      status: "available",
    },
    {
      id: 2,
      date: "2026-09-24",
      start_time: "10:00",
      end_time: "11:00",
      status: "booked",
    },
    {
      id: 3,
      date: "2026-09-25",
      start_time: "09:00",
      end_time: "10:00",
      status: "blocked",
    },
  ],
};

describe("AdminBookingCalendar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders calendar header and loads schedule successfully", async () => {
    adminBookingCalendar.mockResolvedValueOnce(mockSlotsResponse);

    render(<AdminBookingCalendar />);

    expect(screen.getByText(/Availability Overview/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Today/i })).toBeInTheDocument();

    await waitFor(() => {
      const slotButtons = screen.getAllByRole("button", {
        name: /09:00 - 10:00/i,
      });
      expect(slotButtons.length).toBe(2);
    });

    expect(screen.getByText(/Booked/i)).toBeInTheDocument();
    expect(screen.getByTestId("block-unblock-action-bar")).toBeInTheDocument();
  });

  test("handles API error states gracefully", async () => {
    adminBookingCalendar.mockResolvedValueOnce({
      status: "error",
      message: "Database connection failed",
    });

    render(<AdminBookingCalendar />);

    await waitFor(() => {
      expect(
        screen.getByText(/Database connection failed/i),
      ).toBeInTheDocument();
    });
  });

  test("allows selecting and deselecting available slots", async () => {
    adminBookingCalendar.mockResolvedValueOnce(mockSlotsResponse);
    const user = userEvent.setup();

    const { container } = render(<AdminBookingCalendar />);

    const slotButton = await waitFor(() => {
      const btn = container.querySelector(".admin-slot-available");
      expect(btn).toBeInTheDocument();
      return btn;
    });

    expect(slotButton).toHaveClass("admin-slot-available");

    await user.click(slotButton);
    expect(slotButton).toHaveClass("admin-slot-selected");

    await user.click(slotButton);
    expect(slotButton).not.toHaveClass("admin-slot-selected");
  });

  test("prevents selection of booked slots", async () => {
    adminBookingCalendar.mockResolvedValueOnce(mockSlotsResponse);

    render(<AdminBookingCalendar />);

    const bookedSpan = await screen.findByText(/Booked/i);
    expect(bookedSpan).toBeInTheDocument();
    expect(bookedSpan.tagName).toBe("SPAN");
  });
});
