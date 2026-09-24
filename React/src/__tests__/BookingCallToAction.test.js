import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BookingCallToAction from "../BookingCallToAction";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("BookingCallToAction Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component with title, description, and button", () => {
    render(
      <MemoryRouter>
        <BookingCallToAction
          isAuthenticated={false}
          userRole={null}
          isLoading={false}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Need a Garage Appointment?")).toBeInTheDocument();
    expect(
      screen.getByText("Book your slot online for MOT, servicing, or repairs."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Book an Appointment/i }),
    ).toBeInTheDocument();
  });

  test("displays loading state on button when isLoading is true", () => {
    render(
      <MemoryRouter>
        <BookingCallToAction
          isAuthenticated={false}
          userRole={null}
          isLoading={true}
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /Checking session.../i });
    expect(button).toBeDisabled();
  });

  test("navigates to /UserDashboard when authenticated as a customer", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BookingCallToAction
          isAuthenticated={true}
          userRole="customer"
          isLoading={false}
        />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /Book an Appointment/i }),
    );
    expect(mockedNavigate).toHaveBeenCalledWith("/UserDashboard");
  });

  test("navigates to /AdminDashboard when authenticated as a non-customer", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BookingCallToAction
          isAuthenticated={true}
          userRole="admin"
          isLoading={false}
        />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /Book an Appointment/i }),
    );
    expect(mockedNavigate).toHaveBeenCalledWith("/AdminDashboard");
  });

  test("opens sign-in modal when not authenticated", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BookingCallToAction
          isAuthenticated={false}
          userRole={null}
          isLoading={false}
        />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /Book an Appointment/i }),
    );

    expect(screen.getByText("Sign In Required")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Please log in or sign up for an account to schedule your appointment slot/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Log In/i })).toHaveAttribute(
      "href",
      "/UserLogin",
    );
    expect(screen.getByRole("link", { name: /Sign Up/i })).toHaveAttribute(
      "href",
      "/UserRegistration",
    );
  });

  test("closes sign-in modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BookingCallToAction
          isAuthenticated={false}
          userRole={null}
          isLoading={false}
        />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /Book an Appointment/i }),
    );
    expect(screen.getByText("Sign In Required")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /Close/i });
    await user.click(closeBtn);

    expect(screen.queryByText("Sign In Required")).not.toBeInTheDocument();
  });
});
