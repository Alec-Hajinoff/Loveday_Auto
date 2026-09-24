import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BusinessHoursManager from "../BusinessHoursManager";
import { businessHoursManager } from "../ApiService";

jest.mock("../ApiService", () => ({
  businessHoursManager: jest.fn(),
}));

describe("BusinessHoursManager Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading and all seven days of the week with inputs", () => {
    render(<BusinessHoursManager />);

    expect(screen.getByText("Add Opening Hours")).toBeInTheDocument();
    expect(screen.getByLabelText("Monday")).toBeInTheDocument();
    expect(screen.getByLabelText("Tuesday")).toBeInTheDocument();
    expect(screen.getByLabelText("Wednesday")).toBeInTheDocument();
    expect(screen.getByLabelText("Thursday")).toBeInTheDocument();
    expect(screen.getByLabelText("Friday")).toBeInTheDocument();
    expect(screen.getByLabelText("Saturday")).toBeInTheDocument();
    expect(screen.getByLabelText("Sunday")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save Hours/i }),
    ).toBeInTheDocument();
  });

  test("shows validation error if no days are selected on submit", async () => {
    const user = userEvent.setup();
    render(<BusinessHoursManager />);

    await user.click(screen.getByRole("button", { name: /Save Hours/i }));

    expect(
      screen.getByText("Please select at least one day."),
    ).toBeInTheDocument();
  });

  test("shows validation error if a selected day is missing open or close times", async () => {
    const user = userEvent.setup();
    render(<BusinessHoursManager />);

    await user.click(screen.getByLabelText("Monday"));

    await user.click(screen.getByRole("button", { name: /Save Hours/i }));

    expect(
      screen.getByText(
        "Please enter both opening and closing times for all selected days.",
      ),
    ).toBeInTheDocument();
  });

  test("successfully saves business hours, dispatches event, and shows success message", async () => {
    const user = userEvent.setup();
    businessHoursManager.mockResolvedValueOnce({ status: "success" });
    const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");

    render(<BusinessHoursManager />);

    await user.click(screen.getByLabelText("Monday"));

    const allTimeInputs = document.querySelectorAll('input[type="time"]');

    await user.type(allTimeInputs[0], "08:00");
    await user.type(allTimeInputs[1], "17:00");

    await user.click(screen.getByRole("button", { name: /Save Hours/i }));

    expect(businessHoursManager).toHaveBeenCalledWith([
      { day_of_week: 1, open_time: "08:00", close_time: "17:00" },
    ]);

    await waitFor(() => {
      expect(
        screen.getByText("Business hours saved successfully."),
      ).toBeInTheDocument();
    });

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "bookingUpdated" }),
    );

    dispatchEventSpy.mockRestore();
  });

  test("handles API failure response gracefully", async () => {
    const user = userEvent.setup();
    businessHoursManager.mockResolvedValueOnce({
      status: "error",
      message: "Failed to update schedule.",
    });

    render(<BusinessHoursManager />);

    await user.click(screen.getByLabelText("Monday"));
    const allTimeInputs = document.querySelectorAll('input[type="time"]');
    await user.type(allTimeInputs[0], "09:00");
    await user.type(allTimeInputs[1], "17:00");

    await user.click(screen.getByRole("button", { name: /Save Hours/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to update schedule."),
      ).toBeInTheDocument();
    });
  });
});
