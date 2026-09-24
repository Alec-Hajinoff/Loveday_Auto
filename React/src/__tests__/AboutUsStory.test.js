import React from "react";
import { render, screen } from "@testing-library/react";
import AboutUsStory from "../AboutUsStory";

describe("AboutUsStory Component", () => {
  test("renders all main section headings correctly", () => {
    render(<AboutUsStory />);

    expect(
      screen.getByRole("heading", { name: /Motoring Heritage/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Experience You Can Trust/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Proper Care/i }),
    ).toBeInTheDocument();
  });

  test("renders specific garage details, location, and key personnel", () => {
    render(<AboutUsStory />);

    expect(screen.getByText(/50a Southbury Road/i)).toBeInTheDocument();
    expect(screen.getByText(/Mike and Darren/i)).toBeInTheDocument();
    expect(screen.getByText(/Enfield/i)).toBeInTheDocument();
  });

  test("renders the bulleted list of customer commitments", () => {
    render(<AboutUsStory />);

    expect(
      screen.getByText(/You deal with the people actually doing the work/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your car is treated as an individual/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Fair, transparent pricing/i)).toBeInTheDocument();
  });
});
