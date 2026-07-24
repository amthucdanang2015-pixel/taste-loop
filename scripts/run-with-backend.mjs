import { spawnSync } from "node:child_process";
import path from "node:path";
import {
  readBackendOutputs,
  readLeadApiKey,
  root,
} from "./backend-runtime.mjs";

const command = process.argv[2];
if (command !== "dev" && command !== "start") {
  throw new Error("Usage: node scripts/run-with-backend.mjs <dev|start>");
}

const outputs = await readBackendOutputs();
const apiKey = readLeadApiKey(outputs.leadApiKeyId, outputs.leadsRegion);
const next = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);
const result = spawnSync(
  next,
  [command, ...process.argv.slice(3)],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      API_BASE_URL: outputs.leadApiUrl,
      LEAD_API_KEY: apiKey,
    },
  },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
