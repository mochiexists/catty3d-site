import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://catty3d.com";
const ROUTES = ["/", "/download/", "/privacy/", "/support/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({ url: `${SITE_URL}${route}` }));
}
