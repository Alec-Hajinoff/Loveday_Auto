import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserLogin from "../UserLogin";
import { loginUser, passwordResetLink } from "../ApiService";

jest.mock("../ApiService");

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UserLogin Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form elements correctly", () => {
    render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^login$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /forgot your password\?/i }),
    ).toBeInTheDocument();
  });

  test("shows validation error for invalid email format", async () => {
    render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    expect(
      screen.getByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("shows validation error for password less than 8 characters", async () => {
    render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    expect(
      screen.getByText(
        /Please ensure your password is at least 8 characters long/i,
      ),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("successfully logs in customer and navigates to UserDashboard", async () => {
    loginUser.mockResolvedValueOnce({ status: "success", role: "customer" });

    render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "customer@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "securePassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/UserDashboard");
    });
  });

  test("successfully logs in admin and navigates to AdminDashboard", async () => {
    loginUser.mockResolvedValueOnce({ status: "success", role: "admin" });

    render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "admin@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "adminPassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/AdminDashboard");
    });
  });

  test("handles unverified user status", async () => {
    loginUser.mockResolvedValueOnce({
      status: "unverified",
      message: "Please verify your email before logging in.",
    });

    render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "unverified@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Please verify your email before logging in."),
      ).toBeInTheDocument();
    });
  });

  test("handles forgot password flow successfully", async () => {
    passwordResetLink.mockResolvedValueOnce({ status: "success" });

    render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "forgot@domain.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /forgot your password\?/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /If an account exists for this email address, a password reset link has been sent\./i,
        ),
      ).toBeInTheDocument();
    });

    expect(passwordResetLink).toHaveBeenCalledWith("forgot@domain.com");
  });
});
