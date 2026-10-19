import { test as base, expect } from "@playwright/test";
import { getSecretHash, getTestEnvironment } from "../utils/environment";

export const test = base.extend<{
  secretHashLogger: void;
}>({
  secretHashLogger: [
    async ({}, use) => {
      const environment = getTestEnvironment();
      const secretHash = getSecretHash();

      console.log(`[${environment}] SHA-256: ${secretHash}`);

      await use();
    },
    { auto: true },
  ],
});

export { expect };
