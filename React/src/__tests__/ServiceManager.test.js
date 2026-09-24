import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ServiceManager from "../ServiceManager";
import { serviceManager } from "../ApiService";

jest.mock("../ApiService");

describe("ServiceManager Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial service form with one service row", () => {
    render(<ServiceManager />);

    expect(screen.getByText("Add Garage Services")).toBeInTheDocument();
    expect(screen.getByText("Service #1 Name")).toBeInTheDocument();
    expect(screen.getByText("Duration (Minutes)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /\+ Add Another Service/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save Services/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /Remove/i }),
    ).not.toBeInTheDocument();
  });

  test("allows adding and removing service rows", () => {
    render(<ServiceManager />);

    const addButton = screen.getByRole("button", {
      name: /\+ Add Another Service/i,
    });

    fireEvent.click(addButton);
    expect(screen.getByText("Service #2 Name")).toBeInTheDocument();

    const removeButtons = screen.getAllByRole("button", { name: /Remove/i });
    expect(removeButtons.length).toBe(2);

    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText("Service #2 Name")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Remove/i }),
    ).not.toBeInTheDocument();
  });

  test("shows validation message when submitting empty fields", async () => {
    render(<ServiceManager />);

    const saveButton = screen.getByRole("button", { name: /Save Services/i });
    fireEvent.click(saveButton);

    expect(
      screen.getByText(
        /Please complete all required fields \(Name and Duration in minutes\)\./i,
      ),
    ).toBeInTheDocument();

    expect(serviceManager).not.toHaveBeenCalled();
  });

  test("successfully submits services when fields are valid", async () => {
    serviceManager.mockResolvedValueOnce({ status: "success" });

    render(<ServiceManager />);

    const nameInput = screen.getByRole("textbox");
    const durationInput = screen.getByRole("spinbutton");

    fireEvent.change(nameInput, { target: { value: "Full Service" } });
    fireEvent.change(durationInput, { target: { value: "120" } });

    const saveButton = screen.getByRole("button", { name: /Save Services/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Services saved successfully."),
      ).toBeInTheDocument();
    });

    expect(serviceManager).toHaveBeenCalledTimes(1);
    expect(serviceManager).toHaveBeenCalledWith([
      { name: "Full Service", duration_minutes: "120" },
    ]);
  });
});
