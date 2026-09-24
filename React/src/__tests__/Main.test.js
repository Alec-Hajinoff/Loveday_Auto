import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "../Main";

jest.mock(
  "../HeroSection",
  () =>
    ({ isAuthenticated, userRole, isLoading }) => (
      <div data-testid="hero-section">
        Hero Section - Auth: {String(isAuthenticated)}, Role: {userRole},
        Loading: {String(isLoading)}
      </div>
    ),
);

jest.mock("../ServicesSection", () => () => (
  <div data-testid="services-section">Services Section</div>
));

jest.mock(
  "../BookingCallToAction",
  () =>
    ({ isAuthenticated, userRole, isLoading }) => (
      <div data-testid="booking-cta">
        Booking CTA - Auth: {String(isAuthenticated)}, Role: {userRole},
        Loading: {String(isLoading)}
      </div>
    ),
);

jest.mock("../WhyChooseUs", () => () => (
  <div data-testid="why-choose-us">Why Choose Us</div>
));

jest.mock("../TestimonialCarousel", () => () => (
  <div data-testid="testimonial-carousel">Testimonial Carousel</div>
));

describe("Main Component", () => {
  test("renders all major sections and passes props correctly to HeroSection and BookingCallToAction", () => {
    render(
      <Main isAuthenticated={true} userRole="customer" isLoading={false} />,
    );

    const hero = screen.getByTestId("hero-section");
    const services = screen.getByTestId("services-section");
    const cta = screen.getByTestId("booking-cta");
    const whyUs = screen.getByTestId("why-choose-us");
    const testimonials = screen.getByTestId("testimonial-carousel");

    expect(hero).toBeInTheDocument();
    expect(hero).toHaveTextContent(
      "Hero Section - Auth: true, Role: customer, Loading: false",
    );

    expect(services).toBeInTheDocument();
    expect(whyUs).toBeInTheDocument();
    expect(testimonials).toBeInTheDocument();

    expect(cta).toBeInTheDocument();
    expect(cta).toHaveTextContent(
      "Booking CTA - Auth: true, Role: customer, Loading: false",
    );
  });

  test("passes unauthenticated and loading props down properly", () => {
    render(<Main isAuthenticated={false} userRole="" isLoading={true} />);

    const hero = screen.getByTestId("hero-section");
    const cta = screen.getByTestId("booking-cta");

    expect(hero).toHaveTextContent(
      "Hero Section - Auth: false, Role: , Loading: true",
    );
    expect(cta).toHaveTextContent(
      "Booking CTA - Auth: false, Role: , Loading: true",
    );
  });
});
