import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { checkSession } from "../ApiService";

jest.mock("../ApiService");

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing initially while session verification is pending", () => {
    checkSession.mockImplementation(() => new Promise(() => {}));

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Admin Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders children when the user is successfully authenticated", async () => {
    checkSession.mockResolvedValueOnce({ authenticated: true });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Admin Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Protected Admin Content")).toBeInTheDocument();
    });
  });

  test("redirects to home when the user is not authenticated", async () => {
    checkSession.mockResolvedValueOnce({ authenticated: false });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Protected Admin Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument();
      expect(
        screen.queryByText("Protected Admin Content"),
      ).not.toBeInTheDocument();
    });
  });

  test("redirects to home when the session check throws an error", async () => {
    checkSession.mockRejectedValueOnce(new Error("Network failure"));

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Protected Admin Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument();
      expect(
        screen.queryByText("Protected Admin Content"),
      ).not.toBeInTheDocument();
    });
  });
});
