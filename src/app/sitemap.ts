import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { QUALITY_SKILLS } from "@/data/qualitySkills";

const LAST_LAUNCH_UPDATE = new Date("2026-07-28T00:00:00.000Z");
const routes = [
  "",
  "/shipped",
  "/playground",
  "/playground/flowtime",
  "/playground/cards",
  "/skills",
  "/animations",
  "/work",
  "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const mainRoutes: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${BRAND.siteUrl}${path}`,
    lastModified: LAST_LAUNCH_UPDATE,
    changeFrequency: path === "" || path === "/skills" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/work" || path === "/shipped"
          ? 0.9
          : 0.75,
  }));

  const skillRoutes: MetadataRoute.Sitemap = QUALITY_SKILLS.map((skill) => ({
    url: `${BRAND.siteUrl}/skills/${skill.slug}`,
    lastModified: LAST_LAUNCH_UPDATE,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...mainRoutes, ...skillRoutes];
}
