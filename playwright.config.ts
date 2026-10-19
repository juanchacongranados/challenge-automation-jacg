import { defineConfig, devices } from "@playwright/test";
import { execFileSync } from "node:child_process";
import path from "node:path";

execFileSync(
  process.execPath,
  [path.resolve(__dirname, "utils/generatePokemonData.cjs")],
  { stdio: "inherit" },
);

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "api",
      testMatch: [/api\/.*\.spec\.ts/, /environment\.spec\.ts/],
    },

    {
      name: "chromium",
      testMatch: /web\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testMatch: /web\/.*\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testMatch: /web\/.*\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
