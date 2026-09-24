import React from "react";
import { render, screen } from "@testing-library/react";
import AboutUs from "../AboutUs";

jest.mock("../AboutUsStory", () => () => (
  <div data-testid="about-us-story">Mocked AboutUsStory</div>
));

jest.mock(
  "../BookingCallToAction",
  () =>
    ({ isAuthenticated, userRole, isLoading }) => (
      <div data-testid="booking-cta">
        {`BookingCallToAction - Auth: ${isAuthenticated}, Role: ${userRole}, Loading: ${isLoading}`}
      </div>
    ),
);

describe("AboutUs Component", () => {
  test("renders the main hero headlines correctly", () => {
    render(
      <AboutUs isAuthenticated={false} userRole="guest" isLoading={false} />,
    );

    expect(
      screen.getByRole("heading", { name: /Roots in the Community/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A Century of Motoring Heritage/i),
    ).toBeInTheDocument();
  });

  test("renders child components (AboutUsStory and BookingCallToAction)", () => {
    render(
      <AboutUs isAuthenticated={false} userRole="guest" isLoading={false} />,
    );

    expect(screen.getByTestId("about-us-story")).toBeInTheDocument();
    expect(screen.getByTestId("booking-cta")).toBeInTheDocument();
  });

  test("correctly passes authentication and role props down to BookingCallToAction", () => {
    render(
      <AboutUs isAuthenticated={true} userRole="admin" isLoading={true} />,
    );

    const ctaComponent = screen.getByTestId("booking-cta");
    expect(ctaComponent).toHaveTextContent("Auth: true");
    expect(ctaComponent).toHaveTextContent("Role: admin");
    expect(ctaComponent).toHaveTextContent("Loading: true");
  });
});
