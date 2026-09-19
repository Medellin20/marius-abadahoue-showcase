import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });
const booking = { name: "Client Test", email: "client@example.com", phone: "+229 0197000000", city: "Cococodji", age: 25, goal: "Remise en forme", level: "Débutant", availability: "Lundi", date: "2099-01-01", timeSlot: "Matin (8 h – 12 h)", notes: "", consent: true };
function event(path: string, data: unknown, ip = "192.0.2.1", method = "POST") {
  return { path, httpMethod: method, headers: { "content-type": "application/json", "x-nf-client-connection-ip": ip }, body: JSON.stringify(data), isBase64Encoded: false };
}
async function invoke(path: string, data: unknown, ip?: string, method?: string) {
  const { handler } = await import("../netlify/functions/api");
  return await handler(event(path, data, ip, method), {}) as { statusCode: number; body: string; headers: Record<string, string> };
}
function mailConfig() {
  vi.stubEnv("RESEND_API_KEY", "test-key"); vi.stubEnv("BOOKING_EMAIL_TO", "coach@example.com"); vi.stubEnv("BOOKING_EMAIL_FROM", "site@example.com");
}
describe("Netlify function", () => {
  it.each(["/api/bookings", "/.netlify/functions/api/api/bookings"])("handles booking requests at %s", async path => {
    mailConfig(); const send = vi.fn(async () => new Response(JSON.stringify({ id: "mail-test" })));
    vi.stubGlobal("fetch", send);
    const response = await invoke(path, booking);
    expect(response.statusCode).toBe(201); expect(JSON.parse(response.body)).toEqual({ success: true }); expect(send).toHaveBeenCalledOnce();
  });
  it("rejects missing configuration without pretending to send", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await invoke("/api/bookings", booking)).statusCode).toBe(503);
  });
  it("returns JSON for unknown API routes", async () => {
    const response = await invoke("/.netlify/functions/api/api/unknown", {});
    expect(response.statusCode).toBe(404); expect(JSON.parse(response.body).error).toBeTruthy();
  });
  it("does not apply one visitor's rate limit to all Netlify visitors", async () => {
    mailConfig(); vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ id: "mail-test" }))));
    for (let i = 0; i < 5; i++) expect((await invoke("/api/bookings", booking)).statusCode).toBe(201);
    expect((await invoke("/api/bookings", booking)).statusCode).toBe(429);
    expect((await invoke("/api/bookings", booking, "192.0.2.2")).statusCode).toBe(201);
  });
  it("restricts the storage proxy to public site images", async () => {
    const send = vi.fn(); vi.stubGlobal("fetch", send);
    const response = await invoke("/manus-storage/private-file", null, undefined, "GET");
    expect(response.statusCode).toBe(404); expect(send).not.toHaveBeenCalled();
  });
  it("handles missing storage configuration", async () => {
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "");
    expect((await invoke("/manus-storage/marius-gym_6bf1b7f6.jpg", null, undefined, "GET")).statusCode).toBe(503);
  });
  it("redirects public image requests to the signed storage URL", async () => {
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "storage-test-key"); vi.stubEnv("BUILT_IN_FORGE_API_URL", "https://storage.example.com/");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ url: "https://cdn.example.com/gym.jpg" }))));
    const response = await invoke("/.netlify/functions/api/manus-storage/marius-gym_6bf1b7f6.jpg", null, undefined, "GET");
    expect(response.statusCode).toBe(302); expect(response.headers.location).toBe("https://cdn.example.com/gym.jpg");
  });
});
