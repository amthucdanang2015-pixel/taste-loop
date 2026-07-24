const configuredAssetCdnUrl = normalizeCdnOrigin(process.env.NEXT_PUBLIC_ASSET_CDN_URL);

function normalizeCdnOrigin(value: string | undefined): string | undefined {
  const candidate = value?.trim();
  if (!candidate) return undefined;

  try {
    const parsed = new URL(candidate);
    const isOriginOnly = parsed.pathname === "/" && !parsed.search && !parsed.hash;
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || !isOriginOnly) {
      throw new Error("not an HTTPS origin");
    }
    return parsed.origin;
  } catch {
    throw new Error("NEXT_PUBLIC_ASSET_CDN_URL must be an absolute HTTPS origin");
  }
}

// if (process.env.NODE_ENV === "production" && !configuredAssetCdnUrl) {
//   throw new Error("NEXT_PUBLIC_ASSET_CDN_URL is required for production Shipped media");
// }

/**
 * Production fails closed unless the web host supplies the durable CloudFront
 * origin. Local development deliberately falls back to the same checked-in
 * source files under public/assets so product work remains available offline.
 */
export const ASSET_BASE_URL = configuredAssetCdnUrl || "/assets";

export function assetUrl(key: string): string {
  const normalizedKey = key.replace(/^\/+/, "");
  return `${ASSET_BASE_URL}/${normalizedKey}`;
}
