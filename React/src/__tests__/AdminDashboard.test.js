import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminDashboard from "../AdminDashboard";

jest.mock("../AdminBookingsList", () => () => (
  <div data-testid="admin-bookings-list">Mocked AdminBookingsList</div>
));

jest.mock("../AdminBookingCalendar", () => () => (
  <div data-testid="admin-booking-calendar">Mocked AdminBookingCalendar</div>
));

jest.mock("../ServiceManager", () => () => (
  <div data-testid="service-manager">Mocked ServiceManager</div>
));

jest.mock("../BusinessHoursManager", () => () => (
  <div data-testid="business-hours-manager">Mocked BusinessHoursManager</div>
));

jest.mock("../AvailabilityHorizonExtender", () => () => (
  <div data-testid="availability-horizon-extender">
    Mocked AvailabilityHorizonExtender
  </div>
));

describe("AdminDashboard Component", () => {
  test("renders header and defaults to the Bookings tab with correct child components", () => {
    render(<AdminDashboard />);

    expect(
      screen.getByText(
        /Welcome to your admin dashboard\. Manage your bookings, services, and opening hours\./i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /^Bookings$/i })).toHaveClass(
      "active",
    );
    expect(screen.getByRole("button", { name: /^Services$/i })).not.toHaveClass(
      "active",
    );
    expect(
      screen.getByRole("button", { name: /^Opening Hours$/i }),
    ).not.toHaveClass("active");

    expect(screen.getByTestId("admin-bookings-list")).toBeInTheDocument();
    expect(screen.getByTestId("admin-booking-calendar")).toBeInTheDocument();
  });

  test("switches to Services tab when clicked and renders ServiceManager", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard />);

    const servicesTabButton = screen.getByRole("button", {
      name: /^Services$/i,
    });
    await user.click(servicesTabButton);

    expect(servicesTabButton).toHaveClass("active");
    expect(screen.getByTestId("service-manager")).toBeInTheDocument();

    expect(screen.queryByTestId("admin-bookings-list")).not.toBeInTheDocument();
  });

  test("switches to Opening Hours tab when clicked and renders BusinessHoursManager and Extender", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard />);

    const openingHoursTabButton = screen.getByRole("button", {
      name: /^Opening Hours$/i,
    });
    await user.click(openingHoursTabButton);

    expect(openingHoursTabButton).toHaveClass("active");
    expect(screen.getByTestId("business-hours-manager")).toBeInTheDocument();
    expect(
      screen.getByTestId("availability-horizon-extender"),
    ).toBeInTheDocument();

    expect(screen.queryByTestId("admin-bookings-list")).not.toBeInTheDocument();
  });
});
