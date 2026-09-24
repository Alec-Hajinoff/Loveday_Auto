import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "../AppRoutes";

jest.mock("../MainRegLog", () => () => (
  <div data-testid="main-reg-log">MainRegLog</div>
));
jest.mock("../Services", () => () => (
  <div data-testid="services">Services</div>
));
jest.mock("../AboutUs", () => () => <div data-testid="about-us">AboutUs</div>);
jest.mock("../UserLogin", () => () => (
  <div data-testid="user-login">UserLogin</div>
));
jest.mock("../UserRegistration", () => () => (
  <div data-testid="user-registration">UserRegistration</div>
));
jest.mock("../RegisteredPage", () => () => (
  <div data-testid="registered-page">RegisteredPage</div>
));
jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout-component">LogoutComponent</div>
));
jest.mock("../VerifyEmail", () => () => (
  <div data-testid="verify-email">VerifyEmail</div>
));
jest.mock("../PasswordReset", () => () => (
  <div data-testid="password-reset">PasswordReset</div>
));
jest.mock("../UserDashboard", () => () => (
  <div data-testid="user-dashboard">UserDashboard</div>
));
jest.mock("../AdminDashboard", () => () => (
  <div data-testid="admin-dashboard">AdminDashboard</div>
));
jest.mock("../ProtectedRoute", () => ({ children }) => (
  <div data-testid="protected-route">{children}</div>
));

describe("AppRoutes Component", () => {
  test('renders MainRegLog component on default path "/"', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes isAuthenticated={false} userRole={null} isLoading={false} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("main-reg-log")).toBeInTheDocument();
  });

  test('renders Services component on path "/Services"', () => {
    render(
      <MemoryRouter initialEntries={["/Services"]}>
        <AppRoutes isAuthenticated={false} userRole={null} isLoading={false} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("services")).toBeInTheDocument();
  });

  test('renders AboutUs component on path "/AboutUs"', () => {
    render(
      <MemoryRouter initialEntries={["/AboutUs"]}>
        <AppRoutes isAuthenticated={false} userRole={null} isLoading={false} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("about-us")).toBeInTheDocument();
  });

  test('renders UserLogin component on path "/UserLogin"', () => {
    render(
      <MemoryRouter initialEntries={["/UserLogin"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("user-login")).toBeInTheDocument();
  });

  test('renders UserDashboard inside ProtectedRoute on path "/UserDashboard"', () => {
    render(
      <MemoryRouter initialEntries={["/UserDashboard"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("protected-route")).toBeInTheDocument();
    expect(screen.getByTestId("user-dashboard")).toBeInTheDocument();
  });

  test('renders AdminDashboard inside ProtectedRoute on path "/AdminDashboard"', () => {
    render(
      <MemoryRouter initialEntries={["/AdminDashboard"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("protected-route")).toBeInTheDocument();
    expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument();
  });
});
