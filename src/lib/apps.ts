import { get as httpsGet } from "node:https";
import { unstable_cache } from "next/cache";
import {
  APP_STORE_DEVELOPER_ID,
  APP_STORE_PRODUCTS,
  curatedAppIcon,
  curatedScreenshots,
  type AppStoreProduct,
  type ShippedApp,
} from "@/data/shipped";

/** Apple enriches the stable local catalogue; it never owns order or availability. */
interface ItunesApp {
  kind?: string;
  trackId: number;
  trackName: string;
  trackViewUrl?: string;
  primaryGenreName?: string;
}

const APPLE_LOOKUP_TIMEOUT_MS = 8_000;
const APPLE_LOOKUP_MAX_BYTES = 5 * 1024 * 1024;

async function lookup(query: string): Promise<ItunesApp[]> {
  return new Promise((resolve, reject) => {
    const request = httpsGet(`https://itunes.apple.com/lookup?${query}`, {
      headers: { "user-agent": "TasteLoop/1.0" },
    }, (response) => {
      const status = response.statusCode ?? 0;
      if (status < 200 || status >= 300) {
        response.resume();
        reject(new Error(`itunes ${status}`));
        return;
      }

      const chunks: Buffer[] = [];
      let bytes = 0;
      response.on("data", (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > APPLE_LOOKUP_MAX_BYTES) {
          response.destroy(new Error("itunes response exceeded 5 MB"));
          return;
        }
        chunks.push(chunk);
      });
      response.on("end", () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString("utf8")) as { results?: ItunesApp[] };
          resolve(data.results ?? []);
        } catch (error) {
          reject(error);
        }
      });
      response.on("error", reject);
    });

    request.setTimeout(APPLE_LOOKUP_TIMEOUT_MS, () => {
      request.destroy(new Error(`itunes timed out after ${APPLE_LOOKUP_TIMEOUT_MS}ms`));
    });
    request.on("error", reject);
  });
}

/** Cache successful Apple responses daily; rejected lookups are retried later. */
const cachedLookup = unstable_cache(lookup, ["shipped-itunes-lookup"], { revalidate: 86400 });

function fallbackAppleRecord(product: AppStoreProduct): ItunesApp {
  return {
    kind: "software",
    trackId: product.id,
    trackName: product.name,
    trackViewUrl: product.url,
    primaryGenreName: product.genre,
  };
}

function toShippedApp(base: ItunesApp, product: AppStoreProduct): ShippedApp {
  const name = base.trackName || product.name || `App ${base.trackId}`;

  return {
    id: base.trackId,
    name,
    icon: curatedAppIcon(base.trackId),
    screenshots: curatedScreenshots(base.trackId),
    url: base.trackViewUrl ?? product.url,
    genre: base.primaryGenreName ?? product.genre,
    note: product.note,
  };
}

export async function getShippedApps(): Promise<ShippedApp[]> {
  let appleApps: ItunesApp[] = [];

  try {
    appleApps = (await cachedLookup(`id=${APP_STORE_DEVELOPER_ID}&entity=software&limit=50`))
      .filter((result) => result.kind === "software");
  } catch {
    // The stable local records below are the designed offline/upstream fallback.
  }

  const appleById = new Map(appleApps.map((app) => [app.trackId, app]));
  return APP_STORE_PRODUCTS.map((product) =>
    toShippedApp(appleById.get(product.id) ?? fallbackAppleRecord(product), product),
  );
}
