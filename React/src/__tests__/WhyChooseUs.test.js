import React from "react";
import { render, screen } from "@testing-library/react";
import WhyChooseUs from "../WhyChooseUs";

describe("WhyChooseUs Component", () => {
  test("renders the 'Why Choose Us?' heading and all reasons", () => {
    render(<WhyChooseUs />);

    expect(
      screen.getByRole("heading", { name: /Why Choose Us\?/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Family-run since 1926/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Transparent pricing - no hidden fees/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Free collection & delivery/i)).toBeInTheDocument();
    expect(
      screen.getByText(/All work backed by 12-month warranty/i),
    ).toBeInTheDocument();
  });

  test("renders the 'Contact Us' heading and business details with correct links", () => {
    render(<WhyChooseUs />);

    expect(
      screen.getByRole("heading", { name: /Contact Us/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/50a Southbury Rd, Enfield, EN1 1YB/i),
    ).toBeInTheDocument();

    const phoneLink = screen.getByRole("link", { name: /020 8367 5888/i });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute("href", "tel:02083675888");

    const emailLink = screen.getByRole("link", {
      name: /info@lovedayauto.com/i,
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:info@lovedayauto.com");

    expect(screen.getByText(/Mon - Fri \| 8am - 4:30pm/i)).toBeInTheDocument();
  });
});
