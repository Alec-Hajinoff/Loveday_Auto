import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerProfile from "../CustomerProfile";
import { customerProfileGet, customerProfilePost } from "../ApiService";

jest.mock("../ApiService", () => ({
  customerProfileGet: jest.fn(),
  customerProfilePost: jest.fn(),
}));

describe("CustomerProfile Component", () => {
  const mockProfileResponse = {
    status: "success",
    user: {
      first_name: "John",
      surname: "Doe",
      phone: "07123456789",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays loading state initially and renders profile fields on successful fetch", async () => {
    customerProfileGet.mockResolvedValueOnce(mockProfileResponse);

    render(<CustomerProfile />);

    expect(screen.getByText("Loading profile...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("07123456789")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit Details" }),
    ).toBeInTheDocument();
  });

  test("displays error message when profile fetch fails", async () => {
    customerProfileGet.mockResolvedValueOnce({
      status: "error",
      message: "Failed to load profile.",
    });

    render(<CustomerProfile />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load profile.")).toBeInTheDocument();
    });
  });

  test("enables form inputs and action buttons when Edit Details is clicked", async () => {
    customerProfileGet.mockResolvedValueOnce(mockProfileResponse);
    const user = userEvent.setup();

    render(<CustomerProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText("First Name");
    expect(firstNameInput).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Edit Details" }));

    expect(firstNameInput).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("discards changes and exits edit mode when Cancel is clicked", async () => {
    customerProfileGet.mockResolvedValueOnce(mockProfileResponse);
    const user = userEvent.setup();

    render(<CustomerProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Edit Details" }));

    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane");

    expect(firstNameInput).toHaveValue("Jane");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(firstNameInput).toHaveValue("John");
    expect(firstNameInput).toBeDisabled();
  });

  test("successfully updates profile details and shows success message", async () => {
    customerProfileGet.mockResolvedValueOnce(mockProfileResponse);
    customerProfilePost.mockResolvedValueOnce({
      status: "success",
      user: {
        first_name: "Johnathan",
        surname: "Doe",
        phone: "07123456789",
      },
    });

    const user = userEvent.setup();

    render(<CustomerProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Edit Details" }));

    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Johnathan");

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(customerProfilePost).toHaveBeenCalledWith({
      first_name: "Johnathan",
      surname: "Doe",
      phone: "07123456789",
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Your personal details have been successfully updated.",
        ),
      ).toBeInTheDocument();
    });

    expect(firstNameInput).toBeDisabled();
  });

  test("displays error message when profile update fails", async () => {
    customerProfileGet.mockResolvedValueOnce(mockProfileResponse);
    customerProfilePost.mockResolvedValueOnce({
      status: "error",
      message: "Invalid phone number format.",
    });

    const user = userEvent.setup();

    render(<CustomerProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Edit Details" }));
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid phone number format."),
      ).toBeInTheDocument();
    });
  });
});
