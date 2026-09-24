import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { checkSession } from "../ApiService";

jest.mock("../ApiService", () => ({
  checkSession: jest.fn(),
}));

jest.mock("../Header", () => ({ isAuthenticated, isLoading }) => (
  <div data-testid="header">
    Header - Auth: {String(isAuthenticated)} - Loading: {String(isLoading)}
  </div>
));

jest.mock("../NavigationBar", () => ({ isAuthenticated, userRole }) => (
  <div data-testid="navigation-bar">
    NavigationBar - Auth: {String(isAuthenticated)} - Role: {String(userRole)}
  </div>
));

jest.mock("../AppRoutes", () => ({ isAuthenticated, userRole, isLoading }) => (
  <div data-testid="app-routes">
    AppRoutes - Auth: {String(isAuthenticated)} - Role: {String(userRole)} -
    Loading: {String(isLoading)}
  </div>
));

jest.mock("../Footer", () => () => <div data-testid="footer">Footer</div>);
jest.mock("../ScrollToTop", () => () => null);

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("verifies session on mount and passes authenticated status and role to children", async () => {
    checkSession.mockResolvedValueOnce({
      authenticated: true,
      role: "admin",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("header")).toHaveTextContent("Auth: true");
    });

    expect(screen.getByTestId("navigation-bar")).toHaveTextContent(
      "Auth: true - Role: admin",
    );
    expect(screen.getByTestId("app-routes")).toHaveTextContent(
      "Auth: true - Role: admin",
    );
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(checkSession).toHaveBeenCalledTimes(1);
  });

  test("handles session check errors gracefully by defaulting to unauthenticated state", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    checkSession.mockRejectedValueOnce(new Error("Network error"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("header")).toHaveTextContent("Auth: false");
    });

    expect(screen.getByTestId("navigation-bar")).toHaveTextContent(
      "Auth: false - Role: null",
    );
    expect(screen.getByTestId("app-routes")).toHaveTextContent(
      "Auth: false - Role: null",
    );

    consoleSpy.mockRestore();
  });
});
