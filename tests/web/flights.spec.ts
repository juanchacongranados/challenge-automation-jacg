import { test, expect } from "../../fixtures/test.fixture";
import { FlightSearchPage } from "../../pages/FlightSearchPage";
import { FlightBookingPage } from "../../pages/FlightBookingPage";
import { PassengerDetailsPage } from "../../pages/PassengerDetailsPage";
import { StripeCheckoutPage } from "../../pages/StripeCheckoutPage";
import { BookingConfirmationPage } from "../../pages/BookingConfirmationPage";

test.setTimeout(120000);

test("should complete flight booking and successful Stripe sandbox payment", async ({
  page,
}) => {
  const flightSearchPage = new FlightSearchPage(page);

  await flightSearchPage.open();
  await flightSearchPage.selectDepartureAirport();
  await flightSearchPage.selectArrivalAirport();
  await flightSearchPage.selectDepartureDate();
  await flightSearchPage.searchFlights();

  // Complete the flight selection and booking steps.
  const flightBookingPage = new FlightBookingPage(page);

  await flightBookingPage.selectFlight();
  await flightBookingPage.continueToBaggage();
  await flightBookingPage.continueToSeats();
  await flightBookingPage.handleSeatSelection();
  await flightBookingPage.continueToMeals();
  await flightBookingPage.continueToPassengerDetails();

  // Complete passenger information.
  const passengerDetailsPage = new PassengerDetailsPage(page);

  await passengerDetailsPage.fillBasicInformation();
  await passengerDetailsPage.fillCountryPhoneAndBirthDate();
  await passengerDetailsPage.fillNationalityAndPassport();

  // Confirm the booking and proceed to Stripe payment.
  const bookingConfirmationPage = new BookingConfirmationPage(page);

  await bookingConfirmationPage.selectStripePayment();
  await bookingConfirmationPage.confirmBooking();
  await bookingConfirmationPage.proceedToPayment();

  // Complete payment using the Stripe Checkout Page Object.
  const stripeCheckoutPage = new StripeCheckoutPage(page);

  await stripeCheckoutPage.verifyCheckout();
  await stripeCheckoutPage.fillTestCard();
  await stripeCheckoutPage.submitPayment();
  await stripeCheckoutPage.verifySuccessfulPayment();
});
