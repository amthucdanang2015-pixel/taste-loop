import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "assets/shipped-manifest.json");
const publicAssets = path.join(root, "public/assets");

async function walk(relative) {
  const directory = path.join(publicAssets, relative);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await walk(child));
    else files.push(child);
  }
  return files;
}

async function loadManifest() {
  return JSON.parse(await readFile(manifestPath, "utf8"));
}

function manifestPaths(manifest) {
  return [
    ...Object.values(manifest.sites),
    ...Object.values(manifest.apps).flatMap(({ icon, screenshots }) => [
      icon,
      ...screenshots.map(({ path: assetPath }) => assetPath),
    ]),
  ];
}

test("the Shipped manifest owns every public proof asset without orphans", async () => {
  const manifest = await loadManifest();
  const referenced = manifestPaths(manifest).sort();
  const actual = (await walk("shipped")).sort();

  assert.equal(manifest.version, 2);
  assert.equal(new Set(referenced).size, referenced.length, "manifest contains duplicate asset paths");
  assert.deepEqual(actual, referenced, "public Shipped assets and the manifest must match exactly");
  assert.equal(Object.keys(manifest.sites).length, 5);
  assert.equal(Object.keys(manifest.apps).length, 12);
  assert.equal(Object.values(manifest.apps).filter(({ icon }) => icon).length, 12);
  assert.equal(Object.values(manifest.apps).reduce((total, { screenshots }) => total + screenshots.length, 0), 61);
  assert.equal(referenced.length, 78);

  for (const relative of referenced) {
    assert.match(relative, /^shipped\/[a-z0-9./-]+$/, `${relative} is outside the Shipped key boundary`);
    assert.doesNotMatch(relative, /(?:^|\/)\.\.(?:\/|$)|\\|:\/\//, `${relative} is not a safe relative asset path`);
  }
  for (const { screenshots } of Object.values(manifest.apps)) {
    assert.ok(screenshots.length > 0, "every approved app needs proof screenshots");
    for (const screenshot of screenshots) assert.ok(screenshot.alt.trim(), `${screenshot.path} needs alt text`);
  }

  const expectedScreenshots = {
    "6473722198": ["01", "02", "03", "04", "05", "06", "07"],
    "6483942011": ["01", "02", "03"],
    "6757947194": ["01", "02", "03", "04", "05", "06", "07", "08"],
    "6748024051": ["00", "01", "02", "03", "04"],
    "6761237352": ["01", "02", "03", "04"],
    "6749757392": ["01", "02", "03", "04", "05"],
    "6748883355": ["01", "02", "03", "04", "05", "06"],
    "6759958663": ["01", "02", "03", "04"],
    "6758606033": ["01", "02", "03", "04"],
    "6749230692": ["01", "02", "03", "04"],
    "6758385148": ["01", "02", "03", "04", "05", "06"],
    "6759959558": ["01", "02", "03", "04", "05"],
  };
  for (const [id, sequence] of Object.entries(expectedScreenshots)) {
    assert.equal(manifest.apps[id].icon, `shipped/apps/${id}/icon.webp`);
    assert.deepEqual(
      manifest.apps[id].screenshots.map(({ path: assetPath }) => assetPath),
      sequence.map((number) => `shipped/apps/${id}/${number}.webp`),
      `${id} screenshot order changed`,
    );
  }
});

test("proof asset extensions match their real payloads", async () => {
  const manifest = await loadManifest();
  for (const relative of manifestPaths(manifest)) {
    const payload = await readFile(path.join(publicAssets, relative));
    if (relative.endsWith(".webp")) {
      assert.equal(payload.subarray(0, 4).toString(), "RIFF", `${relative} is not WebP`);
      assert.equal(payload.subarray(8, 12).toString(), "WEBP", `${relative} is not WebP`);
    } else if (relative.endsWith(".png")) {
      assert.ok(payload.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `${relative} is not PNG`);
    } else if (relative.endsWith(".svg")) {
      assert.match(payload.toString("utf8", 0, 1024), /<svg\b/i, `${relative} is not SVG`);
    } else {
      assert.fail(`${relative} uses an unsupported public asset extension`);
    }
  }
});

test("the catalogue uses stable IDs, explicit order, and safe asset boundaries", async () => {
  const source = await readFile(path.join(root, "src/data/shipped.ts"), "utf8");
  const appSource = await readFile(path.join(root, "src/lib/apps.ts"), "utf8");
  const apiSource = await readFile(path.join(root, "src/app/api/apps/route.ts"), "utf8");
  const pageSource = await readFile(path.join(root, "src/app/shipped/page.tsx"), "utf8");
  const expectedOrder = [
    "6473722198", "6483942011", "6757947194", "6748024051",
    "6761237352", "6749757392", "6748883355", "6759958663",
    "6758606033", "6749230692", "6758385148", "6759959558",
  ];
  const manifest = await loadManifest();
  let previous = -1;
  for (const id of expectedOrder) {
    const index = source.indexOf(`id: ${id}`);
    assert.ok(index > previous, `${id} is missing or out of editorial order`);
    previous = index;
  }
  assert.deepEqual(Object.keys(manifest.apps).sort(), expectedOrder.toSorted(), "canonical apps and approved media must match exactly");

  assert.doesNotMatch(source, /(?:\/shots\/|\/images\/)/);
  assert.doesNotMatch(source, /new-scan-qr-history-phone|notefly-unverified-users/);
  const siteCatalogue = source.slice(source.indexOf("SHIPPED_SITES"), source.indexOf("] as const;"));
  assert.doesNotMatch(siteCatalogue, /embed:\s*false/, "all currently published live sites permit interactive previews");
  assert.match(appSource, /request\.setTimeout\(APPLE_LOOKUP_TIMEOUT_MS/);
  assert.match(appSource, /const cachedLookup = unstable_cache\(lookup/);
  assert.match(appSource, /icon:\s*curatedAppIcon\(base\.trackId\)/);
  assert.match(appSource, /screenshots:\s*curatedScreenshots\(base\.trackId\)/);
  assert.doesNotMatch(appSource, /artworkUrl|screenshotUrls|remoteScreenshots|newlyPublished/);
  assert.match(apiSource, /screenshots:\s*app\.screenshots\.map\(\(\{ src \}\) => src\)/);
  assert.doesNotMatch(pageSource, /title:\s*["'`][^\n]*\|\s*TasteLoop/, "the root metadata template adds the brand suffix");
  assert.match(await readFile(path.join(root, "tailwind.config.ts"), "utf8"), /import typography from "@tailwindcss\/typography"/);
  assert.doesNotMatch(await readFile(path.join(root, "tailwind.config.ts"), "utf8"), /\brequire\s*\(/);
  const layoutSource = await readFile(path.join(root, "src/app/layout.tsx"), "utf8");
  const footerSource = await readFile(path.join(root, "src/components/Footer.tsx"), "utf8");
  assert.doesNotMatch(layoutSource, /mzstatic|itunes\.apple\.com/);
  assert.match(layoutSource, /<body suppressHydrationWarning className=/, "only the body tolerates extension-injected attributes");
  assert.match(layoutSource, /<Footer year=\{copyrightYear\}/, "the server must serialize the footer year");
  assert.doesNotMatch(footerSource, /new Date\(/, "client-rendered footer markup must not depend on the local clock");
  const assetConfig = await readFile(path.join(root, "src/config/assets.ts"), "utf8");
  assert.match(assetConfig, /NODE_ENV === "production" && !configuredAssetCdnUrl/);
  assert.match(assetConfig, /required for production Shipped media/);
  assert.match(assetConfig, /parsed\.protocol !== "https:"/);
  const nextConfig = await readFile(path.join(root, "next.config.mjs"), "utf8");
  assert.match(nextConfig, /amplify_outputs\.json/);
  assert.match(nextConfig, /process\.env\.NEXT_PUBLIC_ASSET_CDN_URL \|\| sandboxAssetCdnUrl\(\)/);
});

test("the CDN deployment publishes only approved Shipped media and retains private-origin dependencies", async () => {
  const source = await readFile(path.join(root, "amplify/assets/resource.ts"), "utf8");
  const deploySource = await readFile(path.join(root, "scripts/deploy-backend.mjs"), "utf8");

  assert.match(source, /public\/assets\/shipped\//);
  assert.match(source, /destinationKeyPrefix:\s*"site\/shipped"/);
  assert.match(source, /distributionPaths:\s*\["\/shipped\/\*"\]/);
  assert.match(source, /construct instanceof CfnOriginAccessControl/);
  assert.match(source, /construct instanceof CfnBucketPolicy/);
  assert.match(deploySource, /ampx[\s\S]*sandbox/);
  assert.match(deploySource, /cloudformation[\s\S]*deploy/);
  assert.match(deploySource, /--no-fail-on-empty-changeset/);
  assert.match(deploySource, /verify-asset-cdn\.mjs/);
});
