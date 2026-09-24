import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavigationBar from "../NavigationBar";

describe("NavigationBar Component", () => {
  test("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <NavigationBar isAuthenticated={false} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("routes dashboard to /UserLogin when not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavigationBar isAuthenticated={false} />
      </MemoryRouter>,
    );

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink.getAttribute("href")).toBe("/UserLogin");
  });

  test("routes dashboard to /UserDashboard when authenticated as a customer", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavigationBar isAuthenticated={true} userRole="customer" />
      </MemoryRouter>,
    );

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink.getAttribute("href")).toBe("/UserDashboard");
  });

  test("routes dashboard to /AdminDashboard when authenticated as an admin", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavigationBar isAuthenticated={true} userRole="admin" />
      </MemoryRouter>,
    );

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink.getAttribute("href")).toBe("/AdminDashboard");
  });

  test("applies active class to the current route link", () => {
    render(
      <MemoryRouter initialEntries={["/Services"]}>
        <NavigationBar isAuthenticated={false} />
      </MemoryRouter>,
    );

    const servicesLink = screen.getByText("Services");
    expect(servicesLink).toHaveClass("active");

    const homeLink = screen.getByText("Home");
    expect(homeLink).not.toHaveClass("active");
  });
});
