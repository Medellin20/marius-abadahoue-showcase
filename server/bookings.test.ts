import { afterEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { createBookingRouter } from "./bookings";

const valid = { name: "Client Test", email: "client@example.com", phone: "+229 0197000000", city: "Cotonou", age: 25, goal: "Remise en forme", level: "Débutant", availability: "Lundi et jeudi", date: "2099-01-01", timeSlot: "Matin (8 h – 12 h)", notes: "Deux séances", consent: true, website: "" };
const env = { RESEND_API_KEY: "test-key", BOOKING_EMAIL_TO: "coach@example.com", BOOKING_EMAIL_FROM: "site@example.com" };
const servers: Server[] = [];
afterEach(async () => { await Promise.all(servers.splice(0).map(server => new Promise<void>((resolve, reject) => { if (!server.listening) return resolve(); server.close(err => err ? reject(err) : resolve()); }))); });
async function setup(config = env, send = vi.fn().mockImplementation(async () => new Response(JSON.stringify({ id: "email-1" }), { status: 200 }))) {
  const app = express(); app.use("/api/bookings", createBookingRouter(config, send));
  const server = app.listen(0, "127.0.0.1"); servers.push(server);
  await new Promise<void>((resolve, reject) => { server.once("listening", resolve); server.once("error", reject); });
  const address = server.address(); if (!address || typeof address === "string") throw new Error("Missing port");
  const post = (data: unknown) => fetch(`http://127.0.0.1:${address.port}/api/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return { post, send };
}
describe("Coaching booking API", () => {
  it("sends the complete request to the configured coach, with client reply-to", async () => {
    const { post, send } = await setup(); const response = await post({ ...valid, to: "attacker@example.com" });
    expect(response.status).toBe(201); expect(await response.json()).toEqual({ success: true });
    const mail = JSON.parse(send.mock.calls[0][1].body);
    expect(mail.to).toEqual([env.BOOKING_EMAIL_TO]); expect(mail.reply_to).toBe(valid.email);
    for (const value of [valid.name, valid.phone, valid.city, valid.goal, valid.level, valid.availability, valid.date, valid.timeSlot, valid.notes]) expect(mail.text).toContain(value);
  });
  it.each([{ consent: false }, { email: "bad" }, { date: "2020-01-01" }, { date: "2099-02-31" }, { website: "spam" }, { notes: "a".repeat(1501) }])("rejects invalid submissions without sending mail: %j", async invalid => {
    const { post, send } = await setup(); expect((await post({ ...valid, ...invalid })).status).toBe(400); expect(send).not.toHaveBeenCalled();
  });
  it("reports unavailable configuration instead of success", async () => {
    const { post, send } = await setup({ RESEND_API_KEY: "", BOOKING_EMAIL_TO: "", BOOKING_EMAIL_FROM: "" });
    expect((await post(valid)).status).toBe(503); expect(send).not.toHaveBeenCalled();
  });
  it("reports provider errors", async () => {
    const { post } = await setup(env, vi.fn().mockResolvedValue(new Response("error", { status: 500 })));
    expect((await post(valid)).status).toBe(502);
  });
  it("reports timeouts without claiming success", async () => {
    const { post } = await setup(env, vi.fn().mockRejectedValue(new Error("timeout")));
    expect((await post(valid)).status).toBe(502);
  });
  it("limits repeated requests", async () => {
    const { post, send } = await setup(); for (let i = 0; i < 5; i++) expect((await post(valid)).status).toBe(201);
    const response = await post(valid); expect(response.status).toBe(429); expect(response.headers.get("retry-after")).toBeTruthy(); expect(send).toHaveBeenCalledTimes(5);
  });
});
