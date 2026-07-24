import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "assets/shipped-manifest.json"), "utf8"));

async function readOutputs() {
  try {
    return JSON.parse(await readFile(path.join(root, "amplify_outputs.json"), "utf8"));
  } catch {
    return {};
  }
}

const outputs = await readOutputs();
const baseUrl = (
  process.env.ASSET_CDN_URL ??
  process.env.NEXT_PUBLIC_ASSET_CDN_URL ??
  outputs.custom?.assetsCdnUrl
)?.replace(/\/+$/, "");
assert.ok(baseUrl, "Set ASSET_CDN_URL or deploy Amplify so amplify_outputs.json contains custom.assetsCdnUrl");
assert.match(baseUrl, /^https:\/\//, "the asset CDN must use HTTPS");

const paths = [
  ...Object.values(manifest.sites),
  ...Object.values(manifest.apps).flatMap(({ icon, screenshots }) => [
    icon,
    ...screenshots.map(({ path: assetPath }) => assetPath),
  ]),
];
assert.equal(manifest.version, 2, "unsupported Shipped manifest version");
assert.equal(paths.length, 78, "the CDN contract must contain exactly 78 approved assets");
assert.equal(new Set(paths).size, paths.length, "the CDN contract contains duplicate asset paths");
// Test-only mirror of the compatibility-sensitive editorial order in
// src/data/shipped.ts. Numeric-looking object keys are sorted by JavaScript,
// so Object.keys(manifest.apps) cannot prove presentation order.
const canonicalAppIds = [
  "6473722198", "6483942011", "6757947194", "6748024051",
  "6761237352", "6749757392", "6748883355", "6759958663",
  "6758606033", "6749230692", "6758385148", "6759959558",
];

const contentTypes = {
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function verifyAsset(relative) {
  const response = await fetch(`${baseUrl}/${relative}`);
  assert.equal(response.status, 200, `${relative} returned ${response.status}`);
  const contentType = (response.headers.get("content-type") ?? "").split(";", 1)[0];
  assert.equal(contentType, contentTypes[path.extname(relative)], `${relative} has the wrong content type`);
  const cacheControl = response.headers.get("cache-control") ?? "";
  assert.match(cacheControl, /max-age=3600/);
  assert.match(cacheControl, /s-maxage=31536000/);

  const remote = Buffer.from(await response.arrayBuffer());
  const local = await readFile(path.join(root, "public/assets", relative));
  assert.ok(remote.equals(local), `${relative} does not match the repository source`);
}

const concurrency = 8;
for (let start = 0; start < paths.length; start += concurrency) {
  await Promise.all(paths.slice(start, start + concurrency).map(verifyAsset));
}

const redirect = await fetch(`${baseUrl.replace(/^https:/, "http:")}/${paths[0]}`, { redirect: "manual" });
assert.ok([301, 302, 307, 308].includes(redirect.status), `HTTP did not redirect to HTTPS (${redirect.status})`);

const missing = await fetch(`${baseUrl}/shipped/does-not-exist-${Date.now()}.webp`);
assert.ok([403, 404].includes(missing.status), `a missing object unexpectedly returned ${missing.status}`);

const bucketName = outputs.custom?.assetsBucketName;
const bucketRegion = outputs.custom?.assetsRegion;
if (bucketName && bucketRegion) {
  const directS3 = await fetch(
    `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/site/${paths[0]}`,
    { redirect: "manual" },
  );
  assert.equal(directS3.status, 403, `the private S3 object returned ${directS3.status} without CloudFront`);
}

const renderedBaseUrl = process.env.BASE_URL?.replace(/\/+$/, "");
if (renderedBaseUrl) {
  const [home, shipped, apiResponse] = await Promise.all([
    fetch(`${renderedBaseUrl}/`).then((response) => response.text()),
    fetch(`${renderedBaseUrl}/shipped`).then((response) => response.text()),
    fetch(`${renderedBaseUrl}/api/apps`),
  ]);
  assert.equal(apiResponse.status, 200, `/api/apps returned ${apiResponse.status}`);
  const api = await apiResponse.json();
  assert.equal(api.apps.length, Object.keys(manifest.apps).length);
  assert.deepEqual(
    api.apps.map(({ id }) => String(id)),
    canonicalAppIds,
    "/api/apps changed the canonical app order",
  );

  const mediaUrls = api.apps.flatMap((app) => [app.icon, ...app.screenshots]);
  const expectedMediaUrls = canonicalAppIds.flatMap((id) => {
    const { icon, screenshots } = manifest.apps[id];
    return [icon, ...screenshots.map(({ path: assetPath }) => assetPath)]
      .map((assetPath) => `${baseUrl}/${assetPath}`);
  });
  assert.deepEqual(mediaUrls, expectedMediaUrls, "/api/apps media or screenshot order changed");
  for (const url of mediaUrls) {
    assert.ok(url.startsWith(`${baseUrl}/shipped/`), `${url} is not served by the configured CloudFront origin`);
    assert.doesNotMatch(url, /mzstatic|itunes\.apple\.com|\/assets\//);
  }
  for (const [route, html] of [["/", home], ["/shipped", shipped]]) {
    assert.match(html, new RegExp(baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${route} does not render CDN media`);
    assert.doesNotMatch(html, /(?:src|href)=["'](?:\/assets\/shipped|https?:\/\/[^"']*(?:mzstatic|itunes\.apple\.com))/i, `${route} renders non-CDN Shipped media`);
    for (const siteAsset of Object.values(manifest.sites)) {
      assert.ok(
        html.includes(`${baseUrl}/${siteAsset}`),
        `${route} does not render ${siteAsset} from CloudFront`,
      );
    }
  }
}

console.log(`Verified ${paths.length} immutable-source assets through ${baseUrl}`);
