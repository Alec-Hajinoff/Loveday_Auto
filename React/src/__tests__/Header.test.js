import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";

jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout-component">Logout Component</div>
));

const mockUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => mockUseLocation(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({ pathname: "/" });
  });

  test("renders logo with correct alt text, title, and link to home", () => {
    render(
      <MemoryRouter>
        <Header
          isAuthenticated={false}
          isLoading={false}
          onLogoutComplete={() => {}}
        />
      </MemoryRouter>,
    );

    const logoImg = screen.getByAltText("Loveday Auto Repairs Logo");
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute("title", "Loveday Auto Repairs");
    expect(logoImg.closest("a")).toHaveAttribute("href", "/");
  });

  test("renders nothing in auth section when isLoading is true", () => {
    render(
      <MemoryRouter>
        <Header
          isAuthenticated={false}
          isLoading={true}
          onLogoutComplete={() => {}}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign up")).not.toBeInTheDocument();
    expect(screen.queryByTestId("logout-component")).not.toBeInTheDocument();
  });

  test("renders LogoutComponent when isAuthenticated is true and isLoading is false", () => {
    render(
      <MemoryRouter>
        <Header
          isAuthenticated={true}
          isLoading={false}
          onLogoutComplete={() => {}}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("logout-component")).toBeInTheDocument();
    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
  });

  test("renders Log in and Sign up links when isAuthenticated is false and isLoading is false", () => {
    render(
      <MemoryRouter>
        <Header
          isAuthenticated={false}
          isLoading={false}
          onLogoutComplete={() => {}}
        />
      </MemoryRouter>,
    );

    const loginLink = screen.getByRole("link", { name: "Log in" });
    const signupLink = screen.getByRole("link", { name: "Sign up" });

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/UserLogin");
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/UserRegistration");
  });

  test("applies active class to Log in link when pathname is /UserLogin", () => {
    mockUseLocation.mockReturnValue({ pathname: "/UserLogin" });

    render(
      <MemoryRouter>
        <Header
          isAuthenticated={false}
          isLoading={false}
          onLogoutComplete={() => {}}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Log in" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "Sign up" })).not.toHaveClass(
      "active",
    );
  });

  test("applies active class to Sign up link when pathname is /UserRegistration", () => {
    mockUseLocation.mockReturnValue({ pathname: "/UserRegistration" });

    render(
      <MemoryRouter>
        <Header
          isAuthenticated={false}
          isLoading={false}
          onLogoutComplete={() => {}}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Sign up" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "Log in" })).not.toHaveClass(
      "active",
    );
  });
});
