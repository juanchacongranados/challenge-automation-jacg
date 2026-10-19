import { expect, type Page } from "@playwright/test";

export class StripeCheckoutPage {
  constructor(private readonly page: Page) {}

  async verifyCheckout(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout\.stripe\.com/, {
      timeout: 30000,
    });

    await expect(
      this.page.getByRole("textbox", { name: "Card number" }),
    ).toBeVisible({ timeout: 20000 });

    // Never enter card details unless the sandbox indicator is visible.
    await expect(this.page.getByText("Sandbox", { exact: true })).toBeVisible();

    console.log("Stripe Checkout reached successfully.");
  }

  async fillTestCard(): Promise<void> {
    await this.page
      .getByRole("textbox", { name: "Card number" })
      .fill("4242424242424242");

    await this.page.getByRole("textbox", { name: "Expiration" }).fill("1230");

    await this.page
      .getByRole("textbox", {
        name: "Credit or debit card CVC/CVV",
      })
      .fill("123");

    await this.page
      .getByRole("textbox", { name: "Cardholder name" })
      .fill("Carlos Testing");

    console.log("Stripe test payment details completed successfully.");
  }

  async submitPayment(): Promise<void> {
    const submitButton = this.page.getByTestId("hosted-payment-submit-button");

    await expect(submitButton).toBeVisible({
      timeout: 20000,
    });

    await expect(submitButton).toBeEnabled();

    console.log("Stripe test payment is ready for submission.");

    await submitButton.click();

    await expect(this.page).toHaveURL(
      /phptravels\.net\/invoice\/flights\/\d+/,
      { timeout: 45000 },
    );

    console.log("Stripe Sandbox payment submitted and checkout exited.");
  }

  async verifySuccessfulPayment(): Promise<void> {
    await expect(
      this.page.getByText("Payment Successful", { exact: true }),
    ).toBeVisible();

    await expect(
      this.page.getByText(
        "Payment completed successfully. Your booking is being processed.",
      ),
    ).toBeVisible();

    console.log("Stripe Sandbox payment confirmed successfully.");
  }
}
