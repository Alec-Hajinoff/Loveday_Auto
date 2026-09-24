import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AvailabilityHorizonExtender from "../AvailabilityHorizonExtender";
import { availabilityHorizonExtender } from "../ApiService";

jest.mock("../ApiService", () => ({
  availabilityHorizonExtender: jest.fn(),
}));

describe("AvailabilityHorizonExtender Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial layout with heading, description, and button", () => {
    render(<AvailabilityHorizonExtender />);

    expect(
      screen.getByRole("heading", { name: /Generate appointment slots/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Generate 3 additional months of appointment slots starting from the end of the existing schedule horizon\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Generate Additional Slots/i }),
    ).toBeInTheDocument();
  });

  test("successfully extends availability horizon, shows success message, and dispatches custom event", async () => {
    const user = userEvent.setup();

    let resolveApi;
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });

    availabilityHorizonExtender.mockReturnValueOnce(apiPromise);

    const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");

    render(<AvailabilityHorizonExtender />);

    const button = screen.getByRole("button", {
      name: /Generate Additional Slots/i,
    });
    await user.click(button);

    expect(button).toHaveTextContent("Generating Slots...");
    expect(button).toBeDisabled();

    resolveApi({
      status: "success",
      message: "Extended availability slots by 3 additional months.",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Extended availability slots by 3 additional months."),
      ).toBeInTheDocument();
    });

    expect(availabilityHorizonExtender).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "bookingUpdated" }),
    );

    dispatchEventSpy.mockRestore();
  });

  test("handles API error response status gracefully", async () => {
    const user = userEvent.setup();
    availabilityHorizonExtender.mockResolvedValueOnce({
      status: "error",
      message: "Failed to extend availability slots.",
    });

    render(<AvailabilityHorizonExtender />);

    await user.click(
      screen.getByRole("button", { name: /Generate Additional Slots/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to extend availability slots."),
      ).toBeInTheDocument();
    });
  });

  test("handles network exceptions and displays error message", async () => {
    const user = userEvent.setup();
    availabilityHorizonExtender.mockRejectedValueOnce(
      new Error("Network error"),
    );

    render(<AvailabilityHorizonExtender />);

    await user.click(
      screen.getByRole("button", { name: /Generate Additional Slots/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });
});
