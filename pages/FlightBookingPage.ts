import { expect, type Page } from "@playwright/test";

export class FlightBookingPage {
  constructor(private readonly page: Page) {}

  async selectFlight(): Promise<void> {
    const bookingUrl = /\/flights\/booking\/[^/]+#package/;

    // Wait until suppliers finish loading.
    const loadingIndicator = this.page.getByText(
      /Loading from \d+ more suppliers/i,
    );

    await expect(loadingIndicator).toBeHidden({
      timeout: 90000,
    });

    console.log("Flight suppliers loading completed.");

    const bookNowButtons = this.page
      .getByRole("button", { name: /Book Now/ })
      .filter({ visible: true });

    await expect(bookNowButtons.first()).toBeVisible({
      timeout: 20000,
    });

    const totalFlights = await bookNowButtons.count();
    const maxAttempts = Math.min(totalFlights, 15);

    console.log(`Total visible flight options: ${totalFlights}`);

    for (let index = 0; index < maxAttempts; index++) {
      const button = bookNowButtons.nth(index);

      const pagesBefore = this.page.context().pages();

      await button.click();

      // Allow internal navigation or external tabs to appear.
      try {
        await expect(this.page).toHaveURL(bookingUrl, {
          timeout: 4000,
        });

        await expect(
          this.page.getByRole("button", {
            name: "Next arrow_forward",
          }),
        ).toBeVisible({ timeout: 20000 });

        console.log(
          `Internal booking opened using flight option ${index + 1}.`,
        );

        return;
      } catch {
        // A booking URL was reached but its form failed to load.
        if (bookingUrl.test(this.page.url())) {
          throw new Error(
            "Internal booking opened but booking form was not ready.",
          );
        }

        // Close external supplier tabs opened by this attempt.
        const newPages = this.page
          .context()
          .pages()
          .filter((page) => !pagesBefore.includes(page));

        for (const externalPage of newPages) {
          console.log(`External supplier opened: ${externalPage.url()}`);
          await externalPage.close();
        }

        console.log(
          `Flight option ${index + 1} did not open internal booking.`,
        );
      }
    }

    throw new Error(
      `Unable to open internal booking after ${maxAttempts} attempts.`,
    );
  }

  async continueToBaggage(): Promise<void> {
    await this.clickNext();
    await expect(this.page).toHaveURL(/#baggage$/, {
      timeout: 20000,
    });
  }

  async continueToSeats(): Promise<void> {
    await this.clickNext();
    await expect(this.page).toHaveURL(/#seats$/, {
      timeout: 20000,
    });
  }

  async handleSeatSelection(): Promise<void> {
    const chooseSeatsButton = this.page.getByRole("button", {
      name: "event_seat Choose seats",
    });

    const seatUnavailableMessage = this.page.getByText(
      "Seat selection is not offered for this fare.",
      { exact: false },
    );

    await expect(
      chooseSeatsButton.or(seatUnavailableMessage).first(),
    ).toBeVisible({ timeout: 20000 });

    if (await chooseSeatsButton.isVisible()) {
      await chooseSeatsButton.click();

      const seat = this.page.locator("#seat_0_28C");

      await expect(seat).toBeVisible({ timeout: 20000 });
      await seat.click();

      await this.page.getByRole("button", { name: "Confirm" }).click();

      console.log("Seat 28C selected successfully.");
    } else {
      await expect(seatUnavailableMessage).toBeVisible();
      console.log("Seat selection unavailable for this fare.");
    }
  }

  async continueToMeals(): Promise<void> {
    await this.clickNext();

    await expect(this.page).toHaveURL(/#meals$/, {
      timeout: 20000,
    });

    console.log("Meals step reached successfully.");
  }

  async continueToPassengerDetails(): Promise<void> {
    await this.clickNext();

    await expect(this.page.getByPlaceholder("Enter First Name")).toBeVisible({
      timeout: 20000,
    });

    await expect(this.page.getByPlaceholder("Enter Last Name")).toBeVisible();

    console.log("Passenger details form reached successfully.");
  }

  private async clickNext(): Promise<void> {
    await this.page.getByRole("button", { name: "Next arrow_forward" }).click();
  }
}
