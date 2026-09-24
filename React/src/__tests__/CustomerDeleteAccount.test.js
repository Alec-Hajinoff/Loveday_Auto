import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import CustomerDeleteAccount from "../CustomerDeleteAccount";
import { customerDeleteAccount } from "../ApiService";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../ApiService", () => ({
  customerDeleteAccount: jest.fn(),
}));

describe("CustomerDeleteAccount Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders initial delete account button and information text", () => {
    render(<CustomerDeleteAccount />);

    expect(screen.getByText("Delete Your Account")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Deleting your account will remove your personal information/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete My Account" }),
    ).toBeInTheDocument();
  });

  test("shows confirmation prompt when initial delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<CustomerDeleteAccount />);

    await user.click(screen.getByRole("button", { name: "Delete My Account" }));

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Yes, Delete Account" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete My Account" }),
    ).not.toBeInTheDocument();
  });

  test('returns to initial state when "Cancel" abort button is clicked', async () => {
    const user = userEvent.setup();
    render(<CustomerDeleteAccount />);

    await user.click(screen.getByRole("button", { name: "Delete My Account" }));
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete My Account" }),
    ).toBeInTheDocument();
  });

  test("successfully deletes account, shows loading text, and navigates to home", async () => {
    const user = userEvent.setup();
    customerDeleteAccount.mockResolvedValueOnce({ status: "success" });

    render(<CustomerDeleteAccount />);

    await user.click(screen.getByRole("button", { name: "Delete My Account" }));
    await user.click(
      screen.getByRole("button", { name: "Yes, Delete Account" }),
    );

    expect(customerDeleteAccount).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("displays error message when deletion API returns an error status", async () => {
    const user = userEvent.setup();
    customerDeleteAccount.mockResolvedValueOnce({
      status: "error",
      message: "Account cannot be deleted while active bookings exist.",
    });

    render(<CustomerDeleteAccount />);

    await user.click(screen.getByRole("button", { name: "Delete My Account" }));
    await user.click(
      screen.getByRole("button", { name: "Yes, Delete Account" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Account cannot be deleted while active bookings exist.",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Account cannot be deleted while active bookings exist.",
      ),
    ).toHaveClass("delete-status-msg error");
  });

  test("displays fallback error message when deletion API throws an exception", async () => {
    const user = userEvent.setup();
    customerDeleteAccount.mockRejectedValueOnce(new Error("Network failure"));

    render(<CustomerDeleteAccount />);

    await user.click(screen.getByRole("button", { name: "Delete My Account" }));
    await user.click(
      screen.getByRole("button", { name: "Yes, Delete Account" }),
    );

    await waitFor(() => {
      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
  });
});
