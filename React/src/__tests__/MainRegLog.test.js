import React from "react";
import { render, screen } from "@testing-library/react";
import MainRegLog from "../MainRegLog";

jest.mock("../Main", () => ({ isAuthenticated, userRole, isLoading }) => (
  <div data-testid="main-component">
    Main Component - Auth: {String(isAuthenticated)}, Role: {userRole}, Loading:{" "}
    {String(isLoading)}
  </div>
));

describe("MainRegLog Component", () => {
  test("renders Main component and passes down props correctly", () => {
    render(
      <MainRegLog
        isAuthenticated={true}
        userRole="customer"
        isLoading={false}
      />,
    );

    const mainComponent = screen.getByTestId("main-component");
    expect(mainComponent).toBeInTheDocument();
    expect(mainComponent).toHaveTextContent(
      "Main Component - Auth: true, Role: customer, Loading: false",
    );
  });

  test("passes unauthenticated and loading props correctly to Main component", () => {
    render(<MainRegLog isAuthenticated={false} userRole="" isLoading={true} />);

    const mainComponent = screen.getByTestId("main-component");
    expect(mainComponent).toBeInTheDocument();
    expect(mainComponent).toHaveTextContent(
      "Main Component - Auth: false, Role: , Loading: true",
    );
  });
});
