import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("generated Agent Skills match the canonical typed registry", async () => {
  await execFileAsync(
    process.execPath,
    ["scripts/export-skills.mjs", "--check"],
    { cwd: root },
  );
});
