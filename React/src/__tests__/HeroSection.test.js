import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HeroSection from "../HeroSection";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("HeroSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders hero heading and booking button", () => {
    render(
      <MemoryRouter>
        <HeroSection isAuthenticated={false} userRole="" isLoading={false} />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Professional vehicle servicing and repairs/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Book an Appointment" }),
    ).toBeInTheDocument();
  });

  test("shows loading state on button and disables it when isLoading is true", () => {
    render(
      <MemoryRouter>
        <HeroSection isAuthenticated={false} userRole="" isLoading={true} />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: "Checking session..." });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test("navigates to customer dashboard when authenticated as customer", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HeroSection
          isAuthenticated={true}
          userRole="customer"
          isLoading={false}
        />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: "Book an Appointment" }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/UserDashboard");
  });

  test("navigates to admin dashboard when authenticated as non-customer", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HeroSection
          isAuthenticated={true}
          userRole="admin"
          isLoading={false}
        />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: "Book an Appointment" }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/AdminDashboard");
  });

  test("opens sign-in modal when unauthenticated user clicks book button", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HeroSection isAuthenticated={false} userRole="" isLoading={false} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: "Book an Appointment" }),
    );

    expect(screen.getByText("Sign In Required")).toBeInTheDocument();
    expect(
      screen.getByText(/Please log in or sign up for an account/i),
    ).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: "Log In" });
    const signupLink = screen.getByRole("link", { name: "Sign Up" });

    expect(loginLink).toHaveAttribute("href", "/UserLogin");
    expect(signupLink).toHaveAttribute("href", "/UserRegistration");
  });

  test("closes sign-in modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HeroSection isAuthenticated={false} userRole="" isLoading={false} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: "Book an Appointment" }),
    );
    expect(screen.getByText("Sign In Required")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);

    expect(screen.queryByText("Sign In Required")).not.toBeInTheDocument();
  });
});
