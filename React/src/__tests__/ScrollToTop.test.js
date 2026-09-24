import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

function NavigationTrigger({ to }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  }, [to, navigate]);
  return null;
}

describe("ScrollToTop Component", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing (returns null)", () => {
    const { container } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  test("calls window.scrollTo on initial mount and route changes", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollToTop />
        <NavigationTrigger to="/" />
      </MemoryRouter>,
    );

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollToTop />
        <NavigationTrigger to="/Services" />
      </MemoryRouter>,
    );

    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
