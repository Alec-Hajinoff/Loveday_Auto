import React from "react";
import { render, screen } from "@testing-library/react";
import RegisteredPage from "../RegisteredPage";

jest.mock("../UserLogin", () => {
  return function DummyUserLogin() {
    return <div data-testid="user-login-mock">User Login Component</div>;
  };
});

describe("RegisteredPage Component", () => {
  test("renders the email verification thank you message", () => {
    render(<RegisteredPage />);

    expect(
      screen.getByText(
        /thank you for verifying your email address! please log in using your credentials\./i,
      ),
    ).toBeInTheDocument();
  });

  test("renders the UserLogin component", () => {
    render(<RegisteredPage />);

    expect(screen.getByTestId("user-login-mock")).toBeInTheDocument();
  });
});
