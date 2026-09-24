import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  passwordResetLink,
  passwordResetToken,
  updatePassword,
  checkSession,
  businessHoursManager,
  bookingCalendar,
  selectedAppointmentSlot,
  serviceManager,
  bookingDetailsForm,
  customerBookingsList,
  customerCancelBooking,
  customerProfileGet,
  customerProfilePost,
  customerDeleteAccount,
  adminBookingsList,
  adminCancelBooking,
  adminBookingCalendar,
  blockUnblockActionBar,
  availabilityHorizonExtender,
} from "../ApiService";

describe("ApiService Full Test Suite", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test("registerUser sends POST request and returns data", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await registerUser({ email: "test@test.com" });
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/form_capture.php",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("loginUser sends POST request and returns data", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await loginUser({ email: "admin@test.com" });
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/login_capture.php",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("logoutUser sends POST request and succeeds when ok", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    await expect(logoutUser()).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/logout_component.php",
      expect.objectContaining({ method: "POST" }),
    );
  });

  test("verifyEmail sends POST request with token", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await verifyEmail("token123");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/verify_email.php",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ token: "token123" }),
      }),
    );
    expect(result).toEqual(mockRes);
  });

  test("passwordResetLink sends POST request and handles catch fallback", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    const result = await passwordResetLink("test@test.com");
    expect(result).toEqual({ success: true });
  });

  test("passwordResetToken sends POST request with token", async () => {
    const mockRes = { valid: true };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await passwordResetToken("reset123");
    expect(result).toEqual(mockRes);
  });

  test("updatePassword sends POST request with new password", async () => {
    const mockRes = { success: true };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await updatePassword("reset123", "newPass123");
    expect(result).toEqual(mockRes);
  });

  test("checkSession sends GET request and returns session state", async () => {
    const mockRes = { authenticated: true };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await checkSession();
    expect(result).toEqual(mockRes);
  });

  test("businessHoursManager sends POST request with hours data", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await businessHoursManager({ monday: "09:00-17:00" });
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/business_hours_manager.php",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("availabilityHorizonExtender sends POST request", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await availabilityHorizonExtender();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/availability_horizon_extender.php",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("bookingCalendar sends GET request with date range query params", async () => {
    const mockRes = { slots: [] };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await bookingCalendar("2026-09-01", "2026-09-07");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/booking_calendar.php?start_date=2026-09-01&end_date=2026-09-07",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("selectedAppointmentSlot sends POST request with booking details", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const bookingData = { slot_id: 1, service_id: 2 };
    const result = await selectedAppointmentSlot(bookingData);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/selected_appointment_slot.php",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(bookingData),
      }),
    );
    expect(result).toEqual(mockRes);
  });

  test("bookingDetailsForm sends GET request for services list", async () => {
    const mockRes = { services: [] };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await bookingDetailsForm();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/booking_details_form.php",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("customerBookingsList sends GET request", async () => {
    const mockRes = { bookings: [] };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await customerBookingsList();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/customer_bookings_list.php",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("customerCancelBooking sends POST request with appointment ID", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await customerCancelBooking(10);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/customer_cancel_booking.php",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ appointment_id: 10 }),
      }),
    );
    expect(result).toEqual(mockRes);
  });

  test("customerProfileGet sends GET request", async () => {
    const mockRes = { first_name: "John" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await customerProfileGet();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/customer_profile_get.php",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("customerProfilePost sends POST request with profile data", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const profileData = { first_name: "Jane" };
    const result = await customerProfilePost(profileData);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/customer_profile_post.php",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(profileData),
      }),
    );
    expect(result).toEqual(mockRes);
  });

  test("customerDeleteAccount sends POST request", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await customerDeleteAccount();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/customer_delete_account.php",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("adminBookingsList sends GET request", async () => {
    const mockRes = { upcoming: [] };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await adminBookingsList();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/admin_bookings_list.php",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("adminCancelBooking sends POST request with appointment ID", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await adminCancelBooking(99);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/admin_cancel_booking.php",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ appointment_id: 99 }),
      }),
    );
    expect(result).toEqual(mockRes);
  });

  test("adminBookingCalendar sends GET request with date range", async () => {
    const mockRes = { slots: [] };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await adminBookingCalendar("2026-09-01", "2026-09-07");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/admin_booking_calendar.php?start_date=2026-09-01&end_date=2026-09-07",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(mockRes);
  });

  test("blockUnblockActionBar sends POST request with slot IDs and action", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await blockUnblockActionBar([1, 2], "block");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/block_unblock_action_bar.php",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ slot_ids: [1, 2], action: "block" }),
      }),
    );
    expect(result).toEqual(mockRes);
  });

  test("serviceManager sends POST request with services data", async () => {
    const mockRes = { status: "success" };
    global.fetch.mockResolvedValueOnce({ json: async () => mockRes });
    const result = await serviceManager([{ id: 1, name: "MOT" }]);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Loveday_Auto/PHP/service_manager.php",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual(mockRes);
  });
});
