/** Load analytics only when both public settings are configured. */
export function initializeAnalytics() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();
  if (!endpoint || !websiteId) return;

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return;
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/umami`;
  url.search = "";
  url.hash = "";

  const script = document.createElement("script");
  script.defer = true;
  script.src = url.href;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
}
