import { test, expect } from "../../fixtures/test.fixture";
import { FlightSearchPage } from "../../pages/FlightSearchPage";
import { FlightBookingPage } from "../../pages/FlightBookingPage";
import { PassengerDetailsPage } from "../../pages/PassengerDetailsPage";
import { BookingConfirmationPage } from "../../pages/BookingConfirmationPage";

test.setTimeout(120000);

test("should confirm flight booking and generate invoice before payment", async ({
  page,
}) => {
  const flightSearchPage = new FlightSearchPage(page);

  await flightSearchPage.open();
  await flightSearchPage.selectDepartureAirport();
  await flightSearchPage.selectArrivalAirport();
  await flightSearchPage.selectDepartureDate();
  await flightSearchPage.searchFlights();

  const flightBookingPage = new FlightBookingPage(page);

  await flightBookingPage.selectFlight();
  await flightBookingPage.continueToBaggage();
  await flightBookingPage.continueToSeats();
  await flightBookingPage.handleSeatSelection();
  await flightBookingPage.continueToMeals();
  await flightBookingPage.continueToPassengerDetails();

  const passengerDetailsPage = new PassengerDetailsPage(page);

  await passengerDetailsPage.fillBasicInformation();
  await passengerDetailsPage.fillCountryPhoneAndBirthDate();
  await passengerDetailsPage.fillNationalityAndPassport();

  const bookingConfirmationPage = new BookingConfirmationPage(page);

  await bookingConfirmationPage.selectStripePayment();
  await bookingConfirmationPage.confirmBooking();

  // Verify that the invoice is generated without proceeding to Stripe.
  await expect(page).toHaveURL(/\/invoice\/flights\/\d+/);

  console.log("Invoice verified. Payment intentionally not executed.");
});
