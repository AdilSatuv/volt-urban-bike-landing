import { finishes, batteries } from "../content/bike.js";
export function readConfiguration(search) {
  const params = new URLSearchParams(search);
  const get = key => params.getAll(key).length === 1 ? params.get(key) : null;
  return { finish: finishes.some(item => item.id === get("finish")) ? get("finish") : "mist", battery: batteries.some(item => item.id === get("battery")) ? get("battery") : "city", assist: ["1","2","3"].includes(get("assist")) ? Number(get("assist")) : 2, terrain: ["flat","mixed","hills"].includes(get("terrain")) ? get("terrain") : "mixed" };
}
export function configurationLink(href, selection) {
  const url = new URL(href); url.search = "";
  const clean = readConfiguration(new URLSearchParams(selection).toString());
  for (const [key,value] of Object.entries(clean)) url.searchParams.set(key,String(value));
  url.hash = "configure"; return url.href;
}
