import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer Component", () => {
  test("renders copyright notice with current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();

    expect(
      screen.getByText(new RegExp(`© Copyright 2025 - ${currentYear}`)),
    ).toBeInTheDocument();
  });

  test("renders garage address and phone number correctly", () => {
    render(<Footer />);

    expect(
      screen.getByText(/Garage address: 50a Southbury Rd, Enfield, EN1 1YB/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Phone: 020 8367 5888/i)).toBeInTheDocument();
  });

  test("renders constructed email address as a mailto link", () => {
    render(<Footer />);

    const emailLink = screen.getByRole("link", {
      name: "info@lovedayauto.com",
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:info@lovedayauto.com");
  });

  test("renders web application builder attribution link with security attributes", () => {
    render(<Footer />);

    const builderLink = screen.getByRole("link", { name: "Hertford Standard" });
    expect(builderLink).toBeInTheDocument();
    expect(builderLink).toHaveAttribute(
      "href",
      "https://hertfordstandard.com/",
    );
    expect(builderLink).toHaveAttribute("target", "_blank");
    expect(builderLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
