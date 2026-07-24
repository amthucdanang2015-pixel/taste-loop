import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export function runAws(args, { json = true } = {}) {
  const profile = process.env.AWS_PROFILE || "default";
  const result = spawnSync(
    "aws",
    [...args, "--profile", profile],
    {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `AWS command failed (${args.slice(0, 2).join(" ")}): ${result.stderr.trim()}`,
    );
  }
  const output = result.stdout.trim();
  return json ? JSON.parse(output || "{}") : output;
}

export async function readBackendOutputs() {
  const outputs = JSON.parse(
    await readFile(path.join(root, "amplify_outputs.json"), "utf8"),
  );
  const custom = outputs.custom ?? {};
  const required = [
    "leadApiUrl",
    "leadApiId",
    "leadApiKeyId",
    "leadFunctionName",
    "leadsTableName",
    "leadsRegion",
  ];
  for (const key of required) {
    if (typeof custom[key] !== "string" || !custom[key]) {
      throw new Error(`amplify_outputs.json is missing custom.${key}`);
    }
  }
  return custom;
}

export function readLeadApiKey(apiKeyId, region) {
  const value = runAws(
    [
      "apigateway",
      "get-api-key",
      "--api-key",
      apiKeyId,
      "--include-value",
      "--query",
      "value",
      "--output",
      "text",
      "--region",
      region,
    ],
    { json: false },
  );
  if (!value || value === "None") {
    throw new Error("The deployed lead API key has no retrievable value");
  }
  return value;
}
