//Frontend - backend communication must happen over HTTPS on production

export const registerUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/form_capture.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/login_capture.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/logout_component.php",
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout.");
  }
};

// verifyEmail() checks the token in the email against database and redirects to sign in.

export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/verify_email.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw new Error("An error occurred during email verification.");
  }
};

// passwordResetLink() sends a user's email address to the backend to send a password rest email.

export const passwordResetLink = async (email) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/password_reset_link.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("passwordResetLink error:", error);

    return { success: true };
  }
};

// passwordResetToken() verifies if a password reset token is valid and not expired.

export const passwordResetToken = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/password_reset_token.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("passwordResetToken error:", error);
    return {
      valid: false,
      message: "An error occurred while verifying the token.",
    };
  }
};

// updatePassword() updates the user's password and clears the reset token.

export const updatePassword = async (token, newPassword) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/update_password.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: token,
          password: newPassword,
        }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updatePassword error:", error);
    return {
      success: false,
      message: "An error occurred while updating the password.",
    };
  }
};

// checkSession() makes the backend call to check if a session exists.

export const checkSession = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/check_session.php",
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking session:", error);
    return { authenticated: false };
  }
};

// businessHoursManager() sends selected business opening hours to the backend.

export const businessHoursManager = async (businessHoursData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/business_hours_manager.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ business_hours: businessHoursData }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving business hours:", error);
    throw new Error("An error occurred while saving business hours.");
  }
};

// bookingCalendar() retrieves from the database availability slots for a given date range.

export const bookingCalendar = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `http://localhost:8001/Loveday_Auto/PHP/booking_calendar.php?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching booking calendar:", error);
    throw new Error("An error occurred while loading the calendar.");
  }
};

// Sends a selected appointment slot to the database

export const selectedAppointmentSlot = async (bookingData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/selected_appointment_slot.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingData),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error booking appointment slot:", error);
    throw new Error("An error occurred while confirming your booking.");
  }
};

// serviceManager() sends garage services data to the backend

export const serviceManager = async (servicesData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/service_manager.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ services: servicesData }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving services:", error);
    throw new Error("An error occurred while saving services.");
  }
};

// bookingDetailsForm() fetches the available garage services list for the booking form

export const bookingDetailsForm = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Loveday_Auto/PHP/booking_details_form.php",
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching services list:", error);
    throw new Error("An error occurred while fetching services.");
  }
};
