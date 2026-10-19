import { expect, type Page } from "@playwright/test";

export class BookingConfirmationPage {
  constructor(private readonly page: Page) {}

  async selectStripePayment(): Promise<void> {
    const stripePayment = this.page.getByRole("radio", {
      name: "Stripe Stripe Credit Card",
    });

    await this.page.locator('label[for="payment_7"]').click();

    await expect(stripePayment).toBeChecked();

    console.log("Stripe payment method selected successfully.");
  }

  async confirmBooking(): Promise<void> {
    // Accept booking terms and conditions.
    await this.page
      .locator(
        ".pt-6 > .checkbox-item > .checkbox-container > .checkbox-custom",
      )
      .click();

    await this.page
      .getByRole("button", { name: "lock Confirm Booking" })
      .click();

    await expect(this.page).toHaveURL(/\/invoice\/flights\/\d+/, {
      timeout: 30000,
    });

    console.log("Flight booking confirmed and invoice generated successfully.");
  }

  async proceedToPayment(): Promise<void> {
    await this.page
      .getByRole("button", { name: "payment Make Payment" })
      .click();

    const proceedToPaymentButton = this.page.getByRole("button", {
      name: "Proceed to Payment",
    });

    await expect(proceedToPaymentButton).toBeVisible({
      timeout: 20000,
    });

    console.log("Payment confirmation step reached successfully.");

    await proceedToPaymentButton.click();
  }
}
