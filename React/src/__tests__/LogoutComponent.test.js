import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import LogoutComponent from "../LogoutComponent";
import { logoutUser } from "../ApiService";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../ApiService", () => ({
  logoutUser: jest.fn(),
}));

describe("LogoutComponent", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders logout button correctly", () => {
    render(<LogoutComponent />);

    const logoutButton = screen.getByRole("button", { name: "Logout" });
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveClass("header-btn-ghost");
  });

  test("successfully logs out, navigates to home, and calls onLogoutComplete callback", async () => {
    const user = userEvent.setup();
    const mockOnLogoutComplete = jest.fn();
    logoutUser.mockResolvedValueOnce({ status: "success" });

    render(<LogoutComponent onLogoutComplete={mockOnLogoutComplete} />);

    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(logoutUser).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
      expect(mockOnLogoutComplete).toHaveBeenCalledTimes(1);
    });
  });

  test("catches and logs error if logout API request fails", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    logoutUser.mockRejectedValueOnce(new Error("Network error during logout"));

    render(<LogoutComponent />);

    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(logoutUser).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Network error during logout",
      );
    });

    expect(mockNavigate).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
