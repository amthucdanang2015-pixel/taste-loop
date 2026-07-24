import { defineFunction, secret } from "@aws-amplify/backend";

export const leadIntake = defineFunction({
  name: "lead-intake",
  entry: "./handler.ts",
  runtime: 24,
  timeoutSeconds: 20,
  memoryMB: 256,
  architecture: "arm64",
  logging: {
    format: "json",
    level: "info",
    retention: "1 month",
  },
  environment: {
    RESEND_API_KEY: secret("RESEND_API_KEY"),
  },
});
