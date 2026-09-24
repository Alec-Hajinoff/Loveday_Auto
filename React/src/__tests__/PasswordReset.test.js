import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PasswordReset from "../PasswordReset";
import { passwordResetToken, updatePassword } from "../ApiService";

jest.mock("../ApiService");

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("PasswordReset Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows invalid token state when token is missing from URL", async () => {
    render(
      <MemoryRouter initialEntries={["/PasswordReset"]}>
        <PasswordReset />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/this password reset link is no longer valid/i),
      ).toBeInTheDocument();
    });
  });

  test("renders the reset password form when a valid token is provided", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });

    render(
      <MemoryRouter initialEntries={["/PasswordReset?token=valid-token-123"]}>
        <PasswordReset />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm password"),
      ).toBeInTheDocument();
    });
  });

  test("displays an error if the new password is less than 8 characters", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });

    render(
      <MemoryRouter initialEntries={["/PasswordReset?token=valid-token-123"]}>
        <PasswordReset />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    expect(
      screen.getByText(
        /please enter a password that is at least 8 characters long/i,
      ),
    ).toBeInTheDocument();
  });

  test("displays an error if passwords do not match", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });

    render(
      <MemoryRouter initialEntries={["/PasswordReset?token=valid-token-123"]}>
        <PasswordReset />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "securepassword1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "securepassword2" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    expect(
      screen.getByText(/the passwords you entered do not match/i),
    ).toBeInTheDocument();
  });

  test("successfully updates the password and displays success message", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    updatePassword.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter initialEntries={["/PasswordReset?token=valid-token-123"]}>
        <PasswordReset />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "securepassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "securepassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/your password has been updated successfully/i),
      ).toBeInTheDocument();
    });
  });
});
