import { spawnSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const profile = process.env.AWS_PROFILE || "default";
const ampx = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "ampx.cmd" : "ampx");

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(ampx, ["sandbox", "--once", "--profile", profile, "--outputs-out-dir", "."]);

const outputs = JSON.parse(await readFile(path.join(root, "amplify_outputs.json"), "utf8"));
const region = outputs.custom?.leadsRegion || outputs.custom?.assetsRegion;
if (!region) throw new Error("amplify_outputs.json is missing a backend region");

const assemblyDirectory = path.join(root, ".amplify", "artifacts", "cdk.out");
const templates = (await readdir(assemblyDirectory))
  .filter((name) => /^amplify-.*-sandbox-.*\.template\.json$/.test(name));
if (templates.length !== 1) {
  throw new Error(`Expected one Amplify sandbox root template, found ${templates.length}`);
}

const template = templates[0];
const stackName = template.replace(/\.template\.json$/, "");

// Amplify sandboxes use CDK hotswap. BucketDeployment asset changes can be
// reported as updated without changing CloudFormation or copying the new keys.
// Reconcile the synthesized root template directly so the nested deployment
// always receives the published source hash. Branch deployments are already
// direct and do not use this development-only wrapper.
run("aws", [
  "cloudformation",
  "deploy",
  "--template-file",
  path.join(assemblyDirectory, template),
  "--stack-name",
  stackName,
  "--capabilities",
  "CAPABILITY_NAMED_IAM",
  "CAPABILITY_AUTO_EXPAND",
  "--profile",
  profile,
  "--region",
  region,
  "--no-fail-on-empty-changeset",
]);

// A deploy is not complete until both active backend boundaries match the
// repository. The lead verifier is intentionally infrastructure-only: sending
// a real email remains an explicit, opt-in QA command.
run(process.execPath, [path.join(root, "scripts", "verify-asset-cdn.mjs")]);
run(process.execPath, [path.join(root, "scripts", "verify-lead-infrastructure.mjs")]);
