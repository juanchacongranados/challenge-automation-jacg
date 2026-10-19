import { expect, type Page } from "@playwright/test";

export class PassengerDetailsPage {
  constructor(private readonly page: Page) {}

  async fillBasicInformation(): Promise<void> {
    await this.page.getByRole("combobox").first().selectOption("Mr");

    await this.page.getByPlaceholder("Enter First Name").fill("Carlos");
    await this.page.getByPlaceholder("Enter Last Name").fill("Testing");

    await this.page
      .getByRole("textbox", { name: "Enter Email" })
      .fill("carlos.testing@example.com");

    await expect(this.page.getByPlaceholder("Enter First Name")).toHaveValue(
      "Carlos",
    );

    await expect(this.page.getByPlaceholder("Enter Last Name")).toHaveValue(
      "Testing",
    );

    await expect(
      this.page.getByRole("textbox", { name: "Enter Email" }),
    ).toHaveValue("carlos.testing@example.com");

    console.log("Passenger basic information completed successfully.");
  }

  async fillCountryPhoneAndBirthDate(): Promise<void> {
    const countryInput = this.page.getByRole("textbox", {
      name: "Select Country",
    });

    await countryInput.click();
    await countryInput.fill("per");

    await this.page.getByRole("button", { name: "PE Peru +" }).click();

    const phoneInput = this.page.getByRole("textbox", {
      name: "Enter Phone Number",
    });

    await phoneInput.fill("987654321");
    await expect(phoneInput).toHaveValue("987654321");

    await this.page
      .getByRole("button", { name: "Year YYYY Month MM Day DD" })
      .first()
      .click();

    await this.page.getByRole("button", { name: "1990" }).click();
    await this.page.getByRole("button", { name: "June" }).click();
    await this.page.getByRole("button", { name: "15", exact: true }).click();

    console.log("Passenger country, phone and date of birth completed.");
  }

  async fillNationalityAndPassport(): Promise<void> {
    const nationalityInput = this.page.getByRole("textbox", {
      name: "Select Nationality",
    });

    await nationalityInput.click();
    await nationalityInput.fill("per");

    await this.page.getByRole("button", { name: "PE Peru +" }).click();

    const passportInput = this.page.getByRole("textbox", {
      name: "e.g. A12345678",
    });

    await passportInput.fill("A12345678");
    await expect(passportInput).toHaveValue("A12345678");

    await this.page
      .getByRole("button", { name: "Year YYYY Month MM Day DD" })
      .click();

    await this.page.getByRole("button", { name: "2030" }).click();
    await this.page.getByRole("button", { name: "June" }).click();
    await this.page.getByRole("button", { name: "15", exact: true }).click();

    console.log("Passenger nationality and passport completed.");
  }
}
