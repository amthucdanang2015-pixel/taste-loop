import { readFileSync } from "node:fs";

function sandboxAssetCdnUrl() {
  try {
    const outputs = JSON.parse(
      readFileSync(new URL("./amplify_outputs.json", import.meta.url), "utf8"),
    );
    return outputs.custom?.assetsCdnUrl;
  } catch {
    return undefined;
  }
}

// An explicit hosting environment always wins. After `backend:deploy`, the
// ignored Amplify output makes the same real CloudFront origin the local
// default without checking an account-specific hostname into source control.
const assetCdnUrl = process.env.NEXT_PUBLIC_ASSET_CDN_URL || sandboxAssetCdnUrl();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: assetCdnUrl ? { NEXT_PUBLIC_ASSET_CDN_URL: assetCdnUrl } : undefined,
  async redirects() {
    // Old offer surfaces consolidate to /work (constitution §4).
    return [
      { source: "/audit", destination: "/work", permanent: false },
      { source: "/build", destination: "/work", permanent: false },
      { source: "/services", destination: "/work", permanent: false },
      { source: "/services/:slug", destination: "/work", permanent: false },
      { source: "/pricing", destination: "/work", permanent: false },
      { source: "/pro", destination: "/work", permanent: false },
      { source: "/tools/vibe-audit", destination: "/work", permanent: false },
      // Design-studies surface retired for now; the home showcase is the proof (D-017).
      { source: "/redesigns", destination: "/", permanent: false },
      // /styles grew into the multi-product playground (D-021).
      { source: "/styles", destination: "/playground/flowtime", permanent: false },
      { source: "/styles/live", destination: "/playground/flowtime/live", permanent: false },
    ];
  },
};

export default nextConfig;
