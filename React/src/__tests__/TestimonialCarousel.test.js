import React from "react";
import { render, screen } from "@testing-library/react";
import TestimonialCarousel from "../TestimonialCarousel";

describe("TestimonialCarousel Component", () => {
  test("renders the section title and carousel container", () => {
    render(<TestimonialCarousel />);

    expect(screen.getByText("What Our Customers Say")).toBeInTheDocument();

    const carouselContainer = document.getElementById(
      "lovedayTestimonialCarousel",
    );
    expect(carouselContainer).toBeInTheDocument();
  });

  test("renders customer testimonials and author names", () => {
    render(<TestimonialCarousel />);

    expect(screen.getByText("Oliver")).toBeInTheDocument();
    expect(
      screen.getByText(/Brilliant service from start to finish!/i),
    ).toBeInTheDocument();

    expect(screen.getByText("Charlotte")).toBeInTheDocument();
    expect(
      screen.getByText(/I've been taking my car to Loveday for years./i),
    ).toBeInTheDocument();

    expect(screen.getByText("Thomas")).toBeInTheDocument();
    expect(screen.getByText("Hannah")).toBeInTheDocument();
    expect(screen.getByText("Arthur")).toBeInTheDocument();
  });

  test("renders previous and next carousel control buttons", () => {
    render(<TestimonialCarousel />);

    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});
