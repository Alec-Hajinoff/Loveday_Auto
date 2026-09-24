import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ServicesSection from "../ServicesSection";

describe("ServicesSection Component", () => {
  test("renders the main heading and all three service cards", () => {
    render(
      <MemoryRouter>
        <ServicesSection />
      </MemoryRouter>,
    );

    expect(screen.getByText("Our Services")).toBeInTheDocument();

    expect(screen.getByText("MOT & Servicing")).toBeInTheDocument();
    expect(screen.getByText("Brakes & Tyres")).toBeInTheDocument();
    expect(screen.getByText("Diagnostics & Repairs")).toBeInTheDocument();
  });

  test("renders service descriptions and icon alt texts correctly", () => {
    render(
      <MemoryRouter>
        <ServicesSection />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(
        /Comprehensive statutory MOT testing and routine multi-point vehicle servicing/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Expert brake inspections, pad and disc replacements/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Advanced computerised engine diagnostics to pinpoint fault codes/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByAltText("MOT & Servicing")).toBeInTheDocument();
    expect(screen.getByAltText("Brakes & Tyres")).toBeInTheDocument();
    expect(screen.getByAltText("Diagnostics & Repairs")).toBeInTheDocument();
  });

  test("renders 'Learn more' links pointing to the services page", () => {
    render(
      <MemoryRouter>
        <ServicesSection />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link", { name: /learn more →/i });
    expect(links.length).toBe(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/services");
    });
  });
});
