const base = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const seeds = ["/", "/shipped", "/playground", "/playground/flowtime", "/playground/cards", "/skills", "/animations", "/gradient", "/work", "/about"];
const checked = new Map();
const htmlByPath = new Map();
const fragments = [];

async function check(pathname) {
  if (checked.has(pathname)) return;
  const response = await fetch(`${base}${pathname}`, { redirect: "follow" });
  checked.set(pathname, response.status);
  if (!response.ok) throw new Error(`${pathname} returned ${response.status}`);
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return;
  const html = await response.text();
  htmlByPath.set(pathname, html);
  for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/api/")) continue;
    const next = new URL(href, base);
    if (next.origin === new URL(base).origin) {
      const targetPath = next.pathname + next.search;
      if (next.hash && next.hash !== "#main") fragments.push({ source: pathname, targetPath, id: decodeURIComponent(next.hash.slice(1)) });
      await check(targetPath);
    }
  }
}

for (const seed of seeds) await check(seed);
for (const { source, targetPath, id } of fragments) {
  const html = htmlByPath.get(targetPath);
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!html || !new RegExp(`\\sid=["']${escaped}["']`).test(html)) {
    throw new Error(`${source} links to missing fragment ${targetPath}#${id}`);
  }
}
console.log(`Checked ${checked.size} internal routes and ${fragments.length} fragments: all reachable.`);
