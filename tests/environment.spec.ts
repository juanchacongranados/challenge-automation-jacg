import { test, expect } from "../fixtures/test.fixture";
import { getSecretHash, getTestEnvironment } from "../utils/environment";

test("should load the selected environment correctly", async () => {
  const environment = getTestEnvironment();
  const hash = getSecretHash();

  expect(["QA", "CERT"]).toContain(environment);
  expect(hash).toMatch(/^[a-f0-9]{64}$/);
});
