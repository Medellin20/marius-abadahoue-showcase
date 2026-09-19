import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeAnalytics } from "./analytics";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("optional analytics", () => {
  function setup(endpoint: string, websiteId: string) {
    vi.stubEnv("VITE_ANALYTICS_ENDPOINT", endpoint);
    vi.stubEnv("VITE_ANALYTICS_WEBSITE_ID", websiteId);
    const script = { dataset: {}, src: "", defer: false };
    const appendChild = vi.fn();
    vi.stubGlobal("document", { createElement: vi.fn(() => script), head: { appendChild } });
    return { script, appendChild };
  }

  it.each([["", ""], ["https://stats.example.com", ""], ["", "site-id"], ["not-a-url", "site-id"], ["javascript:alert(1)", "site-id"]])("does not load analytics for incomplete or invalid settings: %s, %s", (endpoint, websiteId) => {
    const { appendChild } = setup(endpoint, websiteId);
    initializeAnalytics();
    expect(appendChild).not.toHaveBeenCalled();
  });

  it("loads the configured analytics script with the website identifier", () => {
    const { script, appendChild } = setup("https://stats.example.com/analytics/", "site-id");
    initializeAnalytics();
    expect(script).toEqual({ src: "https://stats.example.com/analytics/umami", defer: true, dataset: { websiteId: "site-id" } });
    expect(appendChild).toHaveBeenCalledWith(script);
  });
});
