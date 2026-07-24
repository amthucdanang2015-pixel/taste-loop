import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  readBackendOutputs,
  readLeadApiKey,
  root,
} from "./backend-runtime.mjs";

const project = JSON.parse(
  await readFile(path.join(root, ".vercel", "project.json"), "utf8"),
);

if (project.projectName !== "vibetoreal") {
  throw new Error(
    `Refusing to configure unexpected Vercel project: ${project.projectName ?? "unknown"}`,
  );
}

const outputs = await readBackendOutputs();
const apiKey = readLeadApiKey(outputs.leadApiKeyId, outputs.leadsRegion);
const assetCdnUrl = outputs.assetsCdnUrl;

if (
  typeof assetCdnUrl !== "string" ||
  !assetCdnUrl.startsWith("https://")
) {
  throw new Error(
    "amplify_outputs.json is missing a secure custom.assetsCdnUrl",
  );
}

const productionVariables = [
  {
    name: "API_BASE_URL",
    value: outputs.leadApiUrl,
    sensitive: false,
  },
  {
    name: "LEAD_API_KEY",
    value: apiKey,
    sensitive: true,
  },
  {
    name: "NEXT_PUBLIC_ASSET_CDN_URL",
    value: assetCdnUrl,
    sensitive: false,
  },
  {
    name: "NEXT_PUBLIC_SITE_URL",
    value: "https://www.tasteloop.work",
    sensitive: false,
  },
];

for (const variable of productionVariables) {
  const result = spawnSync(
    process.env.VERCEL_BIN || "vercel",
    [
      "env",
      "add",
      variable.name,
      "production",
      "--force",
      "--yes",
      variable.sensitive ? "--sensitive" : "--no-sensitive",
    ],
    {
      cwd: root,
      encoding: "utf8",
      input: `${variable.value}\n`,
      stdio: ["pipe", "inherit", "inherit"],
    },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Vercel rejected production variable ${variable.name}`);
  }
}

console.log(
  `Configured ${productionVariables.length} production variables for ${project.projectName}. Secret values were not printed.`,
);
