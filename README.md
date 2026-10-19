# QA Automation Challenge — Monnet Payments

Automated testing project developed with Playwright, TypeScript and the Page Object Model (POM) design pattern.

## Technologies

- Playwright
- TypeScript
- Node.js
- ExcelJS
- dotenv

## Project Structure

- `pages/` — Page Objects for the flight booking and payment flow.
- `tests/web/` — End-to-end flight booking tests.
- `tests/api/` — PokeAPI tests.
- `tests/environment.spec.ts` — Environment configuration validation.
- `fixtures/` — Custom Playwright fixture for SHA-256 logging.
- `utils/` — Environment configuration, Excel reading and test data generation.
- `test-data/` — Excel and generated JSON test data.

## Prerequisites

- Node.js and npm
- Playwright browser binaries

## Installation

```bash
npm ci
npx playwright install
```

## Environment Configuration

Create a `.env` file using `.env.example` as a template:

```env
TEST_ENV=QA
QA_SECRET_KEY=your_qa_secret
CERT_SECRET_KEY=your_cert_secret
```

The `.env` file is excluded from Git.

Before each test, the custom fixture calculates and logs the SHA-256 hash of the secret associated with the selected environment. Original secret values are never printed.

## Running Tests

### API tests — QA

```bash
npm run test:api
```

### API tests — CERT

```bash
npm run test:api:cert
```

### Web E2E — Chromium

```bash
npm run test:web
```

### Web E2E — All configured browsers

```bash
npm run test:web:all
```

### Complete test suite

```bash
npm run test:all
```

### TypeScript validation

```bash
npm run typecheck
```

### HTML report

```bash
npx playwright show-report
```

## API Testing

The API suite uses the public PokeAPI service.

Test data is generated using `utils/generatePokemonData.cjs` and stored in:

- `test-data/Datos-pruebas.xlsx`
- `test-data/pokemon.generated.json`

The suite contains six API tests covering Pokémon retrieval by ID and name.

Each test logs its response time and completion timestamp.

## Web E2E Testing

The web automation covers the following workflow on PHPTravels:

1. Search for a flight from Lima to Miami.
2. Select an available flight.
3. Complete the booking steps, including optional seat selection.
4. Enter fictional passenger details.
5. Select Stripe as the payment method.
6. Confirm the booking and generate an invoice.
7. Complete a simulated payment through Stripe Sandbox.
8. Verify successful payment confirmation.

The test uses Stripe's sandbox test card only. No real payments are performed.

## Page Object Model

The web automation is organized into five Page Objects:

- `FlightSearchPage`
- `FlightBookingPage`
- `PassengerDetailsPage`
- `BookingConfirmationPage`
- `StripeCheckoutPage`

This structure separates test scenarios from page interactions and improves maintainability.

## Test Execution Status

Validated successfully:

- Six PokeAPI tests in QA.
- Six PokeAPI tests in CERT.
- Environment validation in QA and CERT.
- Complete flight booking and Stripe Sandbox payment in Chromium.
- TypeScript static validation.

Firefox and WebKit projects are configured but have not yet been validated end to end.

## Notes

- PHPTravels is a public demonstration application. Its available flights, booking options and UI behavior may change.
- The automated booking uses fictional passenger information.
- Stripe payment automation verifies the Sandbox environment before entering test card details.
- HTML reports, screenshots, traces, dependencies and local secrets are excluded from version control.
