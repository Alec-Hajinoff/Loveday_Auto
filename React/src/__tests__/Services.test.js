import React from "react";
import { render, screen } from "@testing-library/react";
import Services from "../Services";

jest.mock("../ServicesPriceList", () => {
  return function DummyServicesPriceList() {
    return (
      <div data-testid="services-price-list-mock">Services Price List</div>
    );
  };
});

jest.mock("../BookingCallToAction", () => {
  return function DummyBookingCallToAction({
    isAuthenticated,
    userRole,
    isLoading,
  }) {
    return (
      <div data-testid="booking-cta-mock">
        Booking CTA - Auth: {String(isAuthenticated)}, Role: {userRole},
        Loading: {String(isLoading)}
      </div>
    );
  };
});

describe("Services Component", () => {
  test("renders the services hero headline and subheadline", () => {
    render(
      <Services isAuthenticated={false} userRole={null} isLoading={false} />,
    );

    expect(screen.getByText("Our Services & Pricing")).toBeInTheDocument();
    expect(
      screen.getByText(/expert repairs, routine maintenance and mot testing/i),
    ).toBeInTheDocument();
  });

  test("renders child components and passes down authentication and loading props", () => {
    render(
      <Services isAuthenticated={true} userRole="admin" isLoading={false} />,
    );

    expect(screen.getByTestId("services-price-list-mock")).toBeInTheDocument();

    const ctaMock = screen.getByTestId("booking-cta-mock");
    expect(ctaMock).toBeInTheDocument();
    expect(ctaMock).toHaveTextContent("Auth: true");
    expect(ctaMock).toHaveTextContent("Role: admin");
    expect(ctaMock).toHaveTextContent("Loading: false");
  });
});
