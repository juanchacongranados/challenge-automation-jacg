import { expect, type Page } from "@playwright/test";

export class FlightSearchPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("https://phptravels.net/");

    const continueButton = this.page.getByRole("button", {
      name: "I Understand & Continue",
    });

    if (await continueButton.isVisible()) {
      await continueButton.click();
    }

    await expect(
      this.page.getByRole("button", { name: "Search Flights" }),
    ).toBeVisible();
  }

  async selectDepartureAirport(): Promise<void> {
    await this.page.locator("#fl_from_trigger").click();

    await this.page
      .getByRole("textbox", { name: "Departure City or Airport" })
      .fill("Lima");

    await this.page
      .getByText("Lima, Peru Jorge Chavez International Airport LIM")
      .click();

    await expect(this.page.getByText("LIM - J Chavez Intl")).toBeVisible();
  }

  async selectArrivalAirport(): Promise<void> {
    await this.page.locator("#fl_to_trigger").click();

    await this.page
      .getByRole("textbox", { name: "Arrival City or Airport" })
      .fill("Miami");

    await this.page
      .getByText(
        "Miami, Florida, United States Miami International Airport MIA",
      )
      .click();

    await expect(
      this.page.getByText("MIA - Miami", { exact: true }),
    ).toBeVisible();
  }

  async selectDepartureDate(): Promise<void> {
    const departureDate = this.page.getByRole("textbox", {
      name: "Departure Date",
    });

    await departureDate.click();

    const novemberHeader = this.page
      .getByRole("columnheader", { name: "November 2026" })
      .filter({ visible: true })
      .first();

    if (!(await novemberHeader.isVisible())) {
      await this.page.locator(".next > .inline-block").first().click();
    }

    await expect(novemberHeader).toBeVisible();

    await this.page
      .getByRole("table")
      .getByText("20", { exact: true })
      .first()
      .click();

    await expect(departureDate).toHaveValue("Nov 20, 2026");
  }

  async searchFlights(): Promise<void> {
    await this.page.getByRole("button", { name: "Search Flights" }).click();

    await expect(this.page).toHaveURL(
      /\/flights\/lim\/mia\/oneway\/economy\/20-11-2026\/1\/0\/0/,
    );
  }
}
