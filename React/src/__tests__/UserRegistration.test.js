import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserRegistration from "../UserRegistration";
import { registerUser } from "../ApiService";

jest.mock("../ApiService");

describe("UserRegistration Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders registration form fields and submit button correctly", () => {
    render(<UserRegistration />);

    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Choose a strong password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^register$/i }),
    ).toBeInTheDocument();
  });

  test("shows validation error when email format is invalid", async () => {
    render(<UserRegistration />);

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Choose a strong password"), {
      target: { value: "securePassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^register$/i }));

    expect(
      screen.getByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  test("shows validation error when password is less than 8 characters", async () => {
    render(<UserRegistration />);

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Choose a strong password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^register$/i }));

    expect(
      screen.getByText(/Please choose a password with at least 8 characters/i),
    ).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  test("handles successful user registration and displays confirmation message", async () => {
    registerUser.mockResolvedValueOnce({ success: true });

    render(<UserRegistration />);

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "newuser@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Choose a strong password"), {
      target: { value: "securePassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^register$/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/You're almost there! Please check your email/i),
      ).toBeInTheDocument();
    });

    expect(registerUser).toHaveBeenCalledWith({
      email: "newuser@domain.com",
      password: "securePassword123",
    });
  });

  test("handles registration failure from API response", async () => {
    registerUser.mockResolvedValueOnce({
      success: false,
      message: "Email address is already in use.",
    });

    render(<UserRegistration />);

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "existing@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Choose a strong password"), {
      target: { value: "securePassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^register$/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Email address is already in use."),
      ).toBeInTheDocument();
    });
  });
});
