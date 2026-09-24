import React from "react";
import { render, screen } from "@testing-library/react";
import ServicesPriceList from "../ServicesPriceList";

describe("ServicesPriceList Component", () => {
  test("renders all services from the services data array", () => {
    render(<ServicesPriceList />);

    expect(screen.getByText("MOT Testing (Class 4)")).toBeInTheDocument();
    expect(screen.getByText("Full Car Service")).toBeInTheDocument();
    expect(
      screen.getByText("Timing Belt (Cambelt) Replacement"),
    ).toBeInTheDocument();
  });

  test("renders service descriptions, durations, and prices correctly", () => {
    render(<ServicesPriceList />);

    expect(
      screen.getByText(
        "Annual legal safety inspection for cars and light vehicles.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("60 min").length).toBeGreaterThan(0);
    expect(screen.getByText("£45 - £55")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Critical replacement of the cambelt to prevent engine failure.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("240 min")).toBeInTheDocument();
    expect(screen.getByText("£350 - £650")).toBeInTheDocument();
  });

  test("renders the correct number of service items", () => {
    render(<ServicesPriceList />);

    const durationBadges = document.querySelectorAll(".service-duration-badge");
    expect(durationBadges.length).toBe(12);
  });
});
