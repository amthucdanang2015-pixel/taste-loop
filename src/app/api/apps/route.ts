import { NextResponse } from "next/server";
import { getShippedApps } from "@/lib/apps";

/** Cached proxy for the App Store catalogue (see lib/apps). Refreshes daily. */
export const revalidate = 86400;

export async function GET() {
  const apps = await getShippedApps();
  // Keep the established public contract (`screenshots: string[]`) even though
  // the internal UI model now carries richer screenshot alt text.
  return NextResponse.json({
    apps: apps.map((app) => ({
      id: app.id,
      name: app.name,
      icon: app.icon,
      screenshots: app.screenshots.map(({ src }) => src),
      url: app.url,
      genre: app.genre,
    })),
  });
}
