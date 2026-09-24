import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import VerifyEmail from "../VerifyEmail";
import { verifyEmail } from "../ApiService";

jest.mock("../ApiService", () => ({
  verifyEmail: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("VerifyEmail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially when token is present", async () => {
    verifyEmail.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/verify-email?token=test-token-123"]}>
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Verifying your email address.../i),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("navigates to /RegisteredPage on successful verification", async () => {
    verifyEmail.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter initialEntries={["/verify-email?token=valid-token"]}>
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith("valid-token");
      expect(mockedNavigate).toHaveBeenCalledWith("/RegisteredPage");
    });
  });

  test("displays error message when token is missing", async () => {
    render(
      <MemoryRouter initialEntries={["/verify-email"]}>
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/No verification token provided./i),
    ).toBeInTheDocument();
    expect(verifyEmail).not.toHaveBeenCalled();
  });

  test("displays error message and home button when verification fails via API response", async () => {
    verifyEmail.mockResolvedValueOnce({
      success: false,
      message: "Token has expired.",
    });

    render(
      <MemoryRouter initialEntries={["/verify-email?token=expired-token"]}>
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Token has expired./i)).toBeInTheDocument();

    const homeButton = screen.getByRole("button", { name: /Go to home page/i });
    expect(homeButton).toBeInTheDocument();

    userEvent.click(homeButton);
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("handles API rejection errors gracefully", async () => {
    verifyEmail.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter initialEntries={["/verify-email?token=some-token"]}>
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Network Error/i)).toBeInTheDocument();
  });
});
