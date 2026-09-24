import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlockUnblockActionBar from "../BlockUnblockActionBar";
import { blockUnblockActionBar } from "../ApiService";

jest.mock("../ApiService", () => ({
  blockUnblockActionBar: jest.fn(),
}));

describe("BlockUnblockActionBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing when selectedSlots is empty or undefined", () => {
    const { container } = render(<BlockUnblockActionBar selectedSlots={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("displays correct pluralized count and render buttons for available slots", () => {
    const selectedSlots = [
      { id: 1, status: "available" },
      { id: 2, status: "available" },
    ];

    render(
      <BlockUnblockActionBar
        selectedSlots={selectedSlots}
        onActionCompleted={() => {}}
        onClearSelection={() => {}}
      />,
    );

    expect(screen.getByText("2 slots selected")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Block Selected Slots/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Unblock Selected Slots/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  test("displays singular text and unblock button when blocked slots are selected", () => {
    const selectedSlots = [{ id: 1, status: "blocked" }];

    render(
      <BlockUnblockActionBar
        selectedSlots={selectedSlots}
        onActionCompleted={() => {}}
        onClearSelection={() => {}}
      />,
    );

    expect(screen.getByText("1 slot selected")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Unblock Selected Slots/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  test("successfully blocks slots, dispatches event, and calls onActionCompleted", async () => {
    const user = userEvent.setup();
    const selectedSlots = [{ id: 10, status: "available" }];
    const onActionCompletedMock = jest.fn();

    blockUnblockActionBar.mockResolvedValueOnce({ status: "success" });
    const dispatchEventSpy = jest.spyOn(window, "dispatchEvent");

    render(
      <BlockUnblockActionBar
        selectedSlots={selectedSlots}
        onActionCompleted={onActionCompletedMock}
        onClearSelection={() => {}}
      />,
    );

    const blockButton = screen.getByRole("button", {
      name: /Block Selected Slots/i,
    });
    await user.click(blockButton);

    expect(blockUnblockActionBar).toHaveBeenCalledWith([10], "block");

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "bookingUpdated" }),
      );
    });

    expect(onActionCompletedMock).toHaveBeenCalledTimes(1);
    dispatchEventSpy.mockRestore();
  });

  test("calls onClearSelection when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const selectedSlots = [{ id: 1, status: "available" }];
    const onClearSelectionMock = jest.fn();

    render(
      <BlockUnblockActionBar
        selectedSlots={selectedSlots}
        onActionCompleted={() => {}}
        onClearSelection={onClearSelectionMock}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(onClearSelectionMock).toHaveBeenCalledTimes(1);
  });

  test("handles API failure gracefully and alerts message", async () => {
    const user = userEvent.setup();
    const selectedSlots = [{ id: 1, status: "available" }];
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    blockUnblockActionBar.mockResolvedValueOnce({
      status: "error",
      message: "Custom failure message",
    });

    render(
      <BlockUnblockActionBar
        selectedSlots={selectedSlots}
        onActionCompleted={() => {}}
        onClearSelection={() => {}}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /Block Selected Slots/i }),
    );

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Custom failure message");
    });

    alertSpy.mockRestore();
  });
});
