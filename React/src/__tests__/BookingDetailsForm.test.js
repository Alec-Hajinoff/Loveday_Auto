import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingDetailsForm from "../BookingDetailsForm";
import { bookingDetailsForm } from "../ApiService";

jest.mock("../ApiService", () => ({
  bookingDetailsForm: jest.fn(),
}));

describe("BookingDetailsForm Component", () => {
  const mockFormResponse = {
    status: "success",
    services: [
      { id: 101, name: "MOT Test" },
      { id: 102, name: "Full Service" },
    ],
    user: {
      first_name: "Alice",
      surname: "Smith",
      phone: "07123456789",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form fields and loads initial data from API", async () => {
    bookingDetailsForm.mockResolvedValueOnce(mockFormResponse);

    render(<BookingDetailsForm onConfirm={() => {}} submitting={false} />);

    expect(screen.getByText("Enter Appointment Details")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "MOT Test" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("option", { name: "Full Service" }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Smith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("07123456789")).toBeInTheDocument();
  });

  test("shows error message if vehicle registration is empty on submit", async () => {
    const user = userEvent.setup();
    bookingDetailsForm.mockResolvedValueOnce(mockFormResponse);

    render(<BookingDetailsForm onConfirm={() => {}} submitting={false} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: /Confirm Booking/i,
    });
    await user.click(submitButton);

    expect(
      screen.getByText(
        "Please enter a valid vehicle registration number to proceed.",
      ),
    ).toBeInTheDocument();
  });

  test("shows error message if neither service nor notes are provided", async () => {
    const user = userEvent.setup();
    bookingDetailsForm.mockResolvedValueOnce(mockFormResponse);

    render(<BookingDetailsForm onConfirm={() => {}} submitting={false} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    });

    const regInput = screen.getByPlaceholderText(/e.g. AB12CDE/i);
    await user.type(regInput, "AB12CDE");

    const submitButton = screen.getByRole("button", {
      name: /Confirm Booking/i,
    });
    await user.click(submitButton);

    expect(
      screen.getByText(
        "Please select a garage service or provide details in the notes section.",
      ),
    ).toBeInTheDocument();
  });

  test("successfully submits form payload when all required fields are valid", async () => {
    const user = userEvent.setup();
    const handleConfirmMock = jest.fn();
    bookingDetailsForm.mockResolvedValueOnce(mockFormResponse);

    render(
      <BookingDetailsForm onConfirm={handleConfirmMock} submitting={false} />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/e.g. AB12CDE/i), "AB12CDE");

    await user.selectOptions(screen.getByRole("combobox"), "101");

    const submitButton = screen.getByRole("button", {
      name: /Confirm Booking/i,
    });
    await user.click(submitButton);

    expect(handleConfirmMock).toHaveBeenCalledTimes(1);
    expect(handleConfirmMock).toHaveBeenCalledWith({
      service_id: 101,
      vehicle_reg: "AB12CDE",
      notes: null,
      first_name: "Alice",
      surname: "Smith",
      phone: "07123456789",
    });
  });

  test("displays loading text on submit button when submitting is true", async () => {
    bookingDetailsForm.mockResolvedValueOnce(mockFormResponse);

    render(<BookingDetailsForm onConfirm={() => {}} submitting={true} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Booking..." }),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Booking..." })).toBeDisabled();
  });
});
