import { config } from "dotenv";
import { createHash } from "node:crypto";

config({ quiet: true });

export type TestEnvironment = "QA" | "CERT";

export function getTestEnvironment(): TestEnvironment {
  const environment = process.env.TEST_ENV ?? "QA";

  if (environment !== "QA" && environment !== "CERT") {
    throw new Error(`Invalid TEST_ENV: ${environment}. Expected QA or CERT.`);
  }

  return environment;
}

export function getSecretHash(): string {
  const environment = getTestEnvironment();

  const variableName =
    environment === "QA" ? "QA_SECRET_KEY" : "CERT_SECRET_KEY";

  const secret = process.env[variableName];

  if (!secret) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }

  return createHash("sha256").update(secret, "utf8").digest("hex");
}
