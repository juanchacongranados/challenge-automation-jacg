import { test, expect } from "../../fixtures/test.fixture";
import { FlightSearchPage } from "../../pages/FlightSearchPage";

test("should search flights from Lima to Miami", async ({ page }) => {
  const flightSearchPage = new FlightSearchPage(page);

  await flightSearchPage.open();
  await flightSearchPage.selectDepartureAirport();
  await flightSearchPage.selectArrivalAirport();
  await flightSearchPage.selectDepartureDate();
  await flightSearchPage.searchFlights();

  await expect(page).toHaveURL(
    /\/flights\/lim\/mia\/oneway\/economy\/20-11-2026\/1\/0\/0/,
  );
});
